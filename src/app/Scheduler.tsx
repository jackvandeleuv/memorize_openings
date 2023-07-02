import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { scheduler } from 'timers/promises';
import { update } from 'plotly.js';
import { supabaseClient } from '../../utils/supabaseClient';
import { ChessMove } from './ReviewSession';
import { PostgrestError } from '@supabase/supabase-js';


export class Scheduler {
    private newCardLimit: number;
    cards: Card[];
    private queue: Card[];
    private newCardRatio: number;
    private steps: number[];
    private newCount: number = 0;
    private reviewCount: number = 0;
    private cardCache: Map<number, Card>;


    constructor(newCardLimit: number) {
        this.newCardLimit = newCardLimit;
        this.cards = [];
        this.queue = [];
        this.newCardRatio = 5;
        this.steps = [1, 6, 10, 24 * 60];
        this.cardCache = new Map<number, Card>();
    }


    deepCopy(): Scheduler {
        const schedulerCopy = new Scheduler(this.newCardLimit);
        schedulerCopy.cards = [...this.cards];
        schedulerCopy.queue = this.queue;
        schedulerCopy.newCardRatio = this.newCardRatio;
        schedulerCopy.newCount = this.newCount;
        const newMap = new Map(this.cardCache);
        schedulerCopy.cardCache = newMap;
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


    async getNextCard(): Promise<Card | null> {
        if (this.queue.length == 0) { return null };
        if (this.queue.length > 1 && !this.queue[1].hasMoves()) {
            this.updateCardCache(this.queue[1].deepCopy());
        }
        if (this.queue[0].hasMoves()) return this.queue[0].deepCopy();
        if (this.cardCache.has(this.queue[0].lines_id)) {
            return this.cardCache.get(this.queue[0].lines_id)!.deepCopy();
        };

        const card = this.queue[0].deepCopy();

        const moves = await this.getMovesData(card.lines_id);
        if (!moves) {
            console.error('Could not fetch moves successfully.');
            return null;
        }
        for (let move of moves) {
            card.addMove(move);
        }
        return card.deepCopy();
    }


    async updateCardCache(cardToCache: Card): Promise<void> {
        if (cardToCache.hasMoves()) return;
        const moves = await this.getMovesData(cardToCache.lines_id);
        if (!moves) {
            console.error('Move caching failed.');
            return;
        }
        for (let move of moves) {
            cardToCache.addMove(move);
        }
        this.cardCache.set(cardToCache.lines_id, cardToCache);
    }
    

    async getMovesData(lineId: number): Promise<ChessMove[] | null> {
		const movesResponse = await supabaseClient
		  .from('moves')
		  .select('lines_id, fen, order_in_line')
		  .in('lines_id', [lineId]);

		const movesData: ChessMove[] | null = movesResponse.data;
		const movesError: PostgrestError | null = movesResponse.error;
		if (movesError) { 
		  console.error('error', movesError);
		  return null;
		};
		return movesData!;
	  };


    getQueue(): Card[] {
        return [...this.queue];
    }


    addCard(card: Card): void {
        this.cards.push(card.deepCopy());
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

        newCards.sort((a, b) => {
            if (a.reviewAt.getTime() === b.reviewAt.getTime()) {
                return b.getMaxOrderInLine() - a.getMaxOrderInLine();
            }
            return b.reviewAt.getTime() - a.reviewAt.getTime();
        });
        
        revCards.sort((a, b) => {
            if (a.reviewAt.getTime() === b.reviewAt.getTime()) {
                return b.getMaxOrderInLine() - a.getMaxOrderInLine();
            }
            return b.reviewAt.getTime() - a.reviewAt.getTime();
        });

        let limit = this.newCardLimit;
        let i = 0;
        while (revCards.length || (limit && newCards.length)) {
            if (limit && newCards.length && i % this.newCardRatio === 0) {
                this.queue.push(newCards.pop()!);
                limit--;
                i++;
                continue;
            };

            if (revCards.length) this.queue.push(revCards.pop()!);
            i++;
        }
        this.queue.push(...newCards);
    }


    private async updateDbCard(card: Card): Promise<boolean> {
        const { data: cardData, error: cardError } = await supabaseClient
            .from('cards')
            .update({
                'step': card.step,
                'is_new': card.isNew ? 1 : 0,
                'review_at': card.reviewAt,
                'interval': card.interval,
                'ease': card.ease
            })
            .match({'id': card.id});
        if (cardError) {
            console.error(cardError); 
            return false;
        };

        console.log('Setting remaining cards to: ' + this.newCardLimit);
        const { data: limitData, error: limitError } = await supabaseClient
            .from('new_card_limits')
            .update({'remaining_cards': this.newCardLimit})
            .in('decks_id', [card.decks_id])
        if (limitError) {
            console.error(limitError); 
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

        this.newCardLimit = this.newCardLimit - 1;
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