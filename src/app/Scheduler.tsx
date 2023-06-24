import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { scheduler } from 'timers/promises';
import { update } from 'plotly.js';


export class Scheduler {
    private newCardLimit: number;
    private cards: Card[];
    queue: Card[];
    private newCardRatio: number;
    private stepSize: number;
    private steps: number[];

    constructor() {
        this.newCardLimit = 20;
        this.cards = [];
        this.queue = [];
        this.newCardRatio = 5;
        this.stepSize = 3;
        this.steps = [1, 6, 10, 24 * 60]
    }

    deepCopy(): Scheduler {
        const schedulerCopy = new Scheduler();
        schedulerCopy.newCardLimit = this.newCardLimit;
        schedulerCopy.cards = this.cards;
        schedulerCopy.queue = this.queue;
        schedulerCopy.newCardRatio = this.newCardRatio;
        schedulerCopy.stepSize = this.stepSize;
        return schedulerCopy;
    }

    getNextCard(): Card | null {
        if (this.queue.length > 0) console.log('getNextCard -> ' + this.queue[0]);
        else console.log('getNextCard -> empty!');

        if (this.queue.length > 0) return this.queue[0];
        return null;
    }

    addCard(card: Card) {
        this.cards.push(card);
    }

    updateQueue() {
        this.queue = [];
        const newCards: Card[] = [];
        const revCards: Card[] = [];
        for (const card of this.cards) {
            // if (isAfter(new Date(), card.getReviewAt())) continue;
            if (card.isNew) newCards.push(card);
            if (!card.isNew) revCards.push(card);
        }
        newCards.sort((a, b) => b.step - a.step);
        revCards.sort((a, b) => b.interval - a.interval);
        let limit = this.newCardLimit;
        let i = 0;
        while (revCards.length || (limit && newCards.length)) {
            if (limit && newCards.length && i % this.newCardRatio === 0) {
                this.queue.push(newCards.pop() as Card);
                limit -= 1;
                i += 1;
                continue;
            }

            if (revCards.length) this.queue.push(revCards.pop() as Card);
            i += 1;
        }
    }

    
    answerCard(grade: string) {
        if (!this.queue.length) {
            console.log('Empty queue!');
            return null;
        }
        this.gradeCard(grade, this.queue[0]);
        this.updateQueue();
    }

    // Tests out a grade without changing the Cards in the queue
    resultIfGrade(grade: string) {
        return this.gradeCard(grade, this.queue[0].deepCopy());
    }

    private gradeCard(grade: string, card: Card): Card {       
        if (card.isNew) {
            if (grade === 'Again') {
                card.step = 1;
            } else if (grade === 'Good') {
                card.step += 1;
                if (card.step === this.steps.length) card.isNew = false;
            } else if (grade === 'Easy') {
                card.isNew = false;
            } else if (grade !== 'Hard') {
                throw new Error('Unexpected value received for grade');
            }
            
            card.setReviewAt(addMinutes(new Date(), this.steps[card.step - 1]));
        }

        if (!card.isNew) this.updateReviewCard(grade, card);

        return card;
    }

    private updateReviewCard(grade: string, card: Card) {
        if (grade === 'Again') {
            card.ease = Math.max(card.ease * 0.8 / 1000, 1.3);
            card.isNew = true;
            card.step = 1;
            card.setReviewAt(addMinutes(new Date(), 1));
            return;
        }

        if (grade === 'Easy') {
            card.ease = card.ease * 1.15;
        }
        if (grade === 'Hard') {
            card.ease = card.ease * 0.85;
        }
        
        card.interval = card.interval * card.ease / 1000;
        card.setReviewAt(addDays(new Date(), card.interval));
    }
}