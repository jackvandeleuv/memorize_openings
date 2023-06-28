import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { scheduler } from 'timers/promises';
import { update } from 'plotly.js';


export class Scheduler {
    private newCardLimit: number;
    cards: Card[];
    private queue: Card[];
    private newCardRatio: number;
    private steps: number[];
    private newCount: number = 0;

    constructor() {
        this.newCardLimit = 20;
        this.cards = [];
        this.queue = [];
        this.newCardRatio = 5;
        this.steps = [1, 6, 10, 24 * 60]
    }

    deepCopy(): Scheduler {
        const schedulerCopy = new Scheduler();
        schedulerCopy.newCardLimit = this.newCardLimit;
        schedulerCopy.cards = this.cards;
        schedulerCopy.queue = this.queue;
        schedulerCopy.newCardRatio = this.newCardRatio;
        schedulerCopy.newCount = this.newCount;
        return schedulerCopy;
    }

    queueSize(): number {
        return this.queue.length;
    }

    newQueueSize(): number {
        return this.newCount;
    }

    hasNextCard(): boolean {
        return this.queue.length > 0;
    }

    getNextCard(): Card | null {
        if (this.queue.length > 0) return this.queue[0].deepCopy();
        return null;
    }

    getQueue(): Card[] {
        return [...this.queue];
    }

    addCard(card: Card): boolean {
        if (!card.hasMoves()) return false;
        this.cards.push(card.deepCopy());
        return true;
    }

    updateQueue(): void {
        this.newCount = 0;
        this.queue = [];
        const newCards: Card[] = [];
        const revCards: Card[] = [];
        for (const card of this.cards) {
            if (isAfter(card.getReviewAt(), new Date())) continue;
            if (card.isNew) {
                newCards.push(card);
                this.newCount++;
            };
            if (!card.isNew) revCards.push(card);
        }
        newCards.sort((a, b) => b.reviewAt.getTime() - a.reviewAt.getTime());
        revCards.sort((a, b) => b.reviewAt.getTime() - a.reviewAt.getTime());
        let limit = this.newCardLimit;
        let i = 0;
        while (revCards.length || (limit && newCards.length)) {
            if (limit && newCards.length && i % this.newCardRatio === 0) {
                this.queue.push(newCards.pop()!);
                limit--;
                i++;
                continue;
            }

            if (revCards.length) this.queue.push(revCards.pop()!);
            i++;
        }
        this.queue = this.queue.concat(newCards);
    }

    
    answerCard(grade: string): boolean {
        if (!this.queue.length) {
            console.log('Empty queue!');
            return false;
        }
        const gradingNewCard = this.queue[0].isNew;
        this.gradeCard(grade, this.queue[0]);
        if (gradingNewCard && !this.queue[0].isNew) this.newCount--;
        this.updateQueue();
        return true;
    }

    // Tests out a grade without changing the Cards in the queue
    resultIfGrade(grade: string): string {
        if (this.queue.length === 0) return 'Not found.';
        return this.gradeCard(grade, this.queue[0].deepCopy()).reviewTime();
    }

    // Modify card and return it
    private gradeCard(grade: string, card: Card): Card {     
        if (card.isNew) {
            if (grade === 'Again') {
                card.step = 1;
            } else if (grade === 'Good') {
                card.step = card.step + 1;
                if (card.step === this.steps.length) {
                    card.isNew = false;
                    card.setReviewAt(addDays(new Date(), card.interval));
                };
            } else if (grade === 'Easy') {
                card.isNew = false;
                card.setReviewAt(addDays(new Date(), card.interval * 4));
            } else if (grade !== 'Hard') {
                throw new Error('Unexpected value received for grade');
            }

            if (card.isNew) card.setReviewAt(addMinutes(new Date(), this.steps[card.step - 1]));
            return card;
        }
        
        this.updateReviewCard(grade, card);
        return card;
    }

    private updateReviewCard(grade: string, card: Card): void {
        if (grade === 'Again') {
            card.ease = Math.max(card.ease * 0.8 / 1000, 1.3);
            card.isNew = true;
            this.newCount++;
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