import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { scheduler } from 'timers/promises';
import { update } from 'plotly.js';
import { supabaseClient } from '../../utils/supabaseClient';


export class Scheduler {
    private newCardLimit: number;
    cards: Card[];
    private queue: Card[];
    private newCardRatio: number;
    private steps: number[];
    private newCount: number = 0;
    private reviewCount: number = 0;


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


    getReviewQueueSize(): number {
        return this.reviewCount;
    }


    setReviewQueueSize(newReview: number): void {
        this.reviewCount = newReview;
    }


    getNewQueueSize(): number {
        return this.newCount;
    }


    setNewQueueSize(newSize: number): void {
        console.log('setting new queue size: ' + newSize);
        this.newCount = newSize;
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

        // Make sure cards moves go from 1-n in order
        const moves = card.getMoves();
        let i = 1;
        for (let move of moves) {
            if (move.order_in_line !== i) {
                console.error('Tried to add card with incomplete moves to scheduler.');
                return false;
            };
            i++;
        };

        this.cards.push(card.deepCopy());
        return true;
    }


    updateQueue(): void {
        this.queue = [];
        const newCards: Card[] = [];
        const revCards: Card[] = [];
        for (const card of this.cards) {
            if (card.isNew) {
                newCards.push(card);
            };
            if (!card.isNew && isAfter(new Date(), card.getReviewAt())) {
                revCards.push(card);
            };
        }
        console.log('new cards pre sort: ')
        console.log(newCards)
        newCards.sort((a, b) => b.reviewAt.getTime() - a.reviewAt.getTime());
        revCards.sort((a, b) => b.reviewAt.getTime() - a.reviewAt.getTime());
        let limit = this.newCardLimit;
        let i = 0;
        console.log('(limit && newCards.length)' + (limit && newCards.length))
        while (revCards.length || (limit && newCards.length)) {
            if (limit && newCards.length && i % this.newCardRatio === 0) {
                console.log('pushing newCards.pop()')
                this.queue.push(newCards.pop()!);
                limit--;
                i++;
                continue;
            };

            if (revCards.length) this.queue.push(revCards.pop()!);
            i++;
        }
        this.queue.push(...newCards);
        console.log('Queue after build: ')
        console.log(this.queue)
        console.log('Cards after build:')
        console.log(this.cards)
    }


    private async updateDbCard(card: Card): Promise<boolean> {
        const { data, error } = await supabaseClient.from('cards')
            .update({
                'step': card.step,
                'is_new': card.isNew ? 1 : 0,
                'review_at': card.reviewAt,
                'interval': card.interval,
                'ease': card.ease
            })
            .match({'id': card.id});
        if (error) {
            console.error(error); 
            return false;
        };
        return true;
    }

    
    async answerCard(grade: string): Promise<boolean> {
        if (!this.queue.length) {
            console.log('Empty queue!');
            return false;
        }

        const gradingNewCard = this.queue[0].isNew;
        this.gradeCard(grade, this.queue[0]);
        if (gradingNewCard && !this.queue[0].isNew) {
            this.newCount--; 
        };

        const updateSuccess = await this.updateDbCard(this.queue[0]);
        if (!updateSuccess) throw new Error('Db update failed.');
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
            if (card.step === 1 && grade === 'Hard') {
                card.step = 2;
            } else if (card.step === 1 && grade === 'Good') {
                card.step = 3;
            } else if (grade === 'Again') {
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