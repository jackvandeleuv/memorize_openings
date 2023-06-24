import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { scheduler } from 'timers/promises';

const steps = new Map<number, number>();
steps.set(1, 1);
steps.set(2, 6);
steps.set(3, 10);
steps.set(4, 24 * 60);

export class Scheduler {
    private newCardLimit: number;
    private cards: Card[];
    private queue: Card[];
    private newCardRatio: number;
    private stepSize: number;

    constructor() {
        this.newCardLimit = 20;
        this.cards = [];
        this.queue = [];
        this.newCardRatio = 5;
        this.stepSize = 3;
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
            if (isAfter(new Date(), card.reviewAt)) {
                continue;
            }
            if (card.isNew) {
                newCards.push(card);
            } else {
                revCards.push(card);
            }
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
            if (revCards.length) {
                this.queue.push(revCards.pop() as Card);
            }
            i += 1;
        }
    }

    answerCard(grade: string) {
        if (!this.queue.length) {
            console.log('Empty queue!');
            return;
        }

        const card = this.queue[0];
        this.newCardLimit -= 1;
        
        console.log();
        console.log('Before:', card);

        if (!card.isNew) {
            this.updateReviewCard(grade, card);
        }

        if (card.isNew) {
            if (grade === 'Again') {
                card.step = 1;
            } else if (grade === 'Good') {
                card.step += 1;
            } else if (grade === 'Easy') {
                card.isNew = false;
            } else {
                throw new Error();
            }
            
            card.reviewAt = addMinutes(new Date(), steps.get(card.step)!);
        }

        console.log('After:', card);
        console.log();

        this.updateQueue();

        console.log('Queue updated to: ' );
        for (let card of this.queue) {
            if (!card) continue;
            console.log(card.moves);
        }
    }

    private updateReviewCard(grade: string, card: Card) {
        if (grade === 'Again') {
            card.ease = Math.max(card.ease * 0.8, 1.3);
            card.isNew = true;
            card.step = 1;
            card.reviewAt = addMinutes(new Date(), 1);
            return;
        }

        if (grade === 'Easy') {
            card.ease = card.ease * 1.15;
        }
        if (grade === 'Hard') {
            card.ease = card.ease * 0.85;
        }
        
        card.interval = card.interval * card.ease;
        card.reviewAt = addDays(new Date(), card.interval);
    }
}