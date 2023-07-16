import { addMinutes, addDays, isAfter } from 'date-fns';
import { Card } from './Card';
import { ChessMove } from './ReviewSession';
import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient } from '../utils/supabaseClient';


export class Scheduler {
    private newCardLimit: number;
    cards: Card[];
    private queue: Card[];
    private newCardRatio: number;
    private steps: number[];
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
        const newMap = new Map(this.cardCache);
        schedulerCopy.cardCache = newMap;
        return schedulerCopy;
    }


    hasNextCard(): boolean {
        return this.queue.length > 0;
    }


    getCards(): Card[] {
        const cardsToReturn = [];
        for (let card of this.cards) {
            const cardCopy = card.deepCopy();
            cardsToReturn.push(cardCopy);
        }
        return cardsToReturn;
    }


    async getNextCard(): Promise<Card | null> {
        if (this.queue.length == 0) return null;
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
            if (card.neverSeen) {
                newCards.push(card);
            } else {
                revCards.push(card);
            }
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
        while (revCards.length || (limit && newCards.length)) {
            if (limit && newCards.length && Math.floor(Math.random() * Math.sqrt(revCards.length)) % this.newCardRatio === 0) {
                this.queue.push(newCards.pop()!);
                limit--;
                continue;
            };

            if (revCards.length) this.queue.push(revCards.pop()!);
        }
        this.queue.push(...newCards);
    }


    private async updateDbCard(card: Card, gradingNeverSeen: boolean): Promise<boolean> {
        const { data: cardData, error: cardError } = await supabaseClient
            .from('cards')
            .update({
                'step': card.step,
                'is_learning': (card.getIsLearning() ? 1 : 0),
                'review_at': card.reviewAt,
                'interval': card.interval,
                'ease': card.ease,
                'never_seen': card.neverSeen
            })
            .match({'id': card.id});
        if (cardError) {
            console.error(cardError); 
            return false;
        };

        // Let the db know if we used up one of our new cards for the day
        if (!gradingNeverSeen) return true; 
        const { data: limitData, error: limitError } = await supabaseClient
            .rpc('decrement_remaining_cards', { _id_to_update: card.decks_id});
        if (limitError) {
            console.error(limitError); 
            return false;
        };

        return true;
    }

    
    async answerCard(grade: string): Promise<boolean> {
        if (!this.queue.length) {
            return false;
        }

        const gradingNeverSeen = this.queue[0].neverSeen;
        this.gradeCard(grade, this.queue[0]);
        this.queue[0].neverSeen = 0;

        if (gradingNeverSeen === 1) {
            this.newCardLimit = this.newCardLimit - 1;
        }       
        const updateSuccess = await this.updateDbCard(this.queue[0], gradingNeverSeen === 1);
        if (!updateSuccess) throw new Error('Db update failed.');

        const oneHourFromNow = new Date(new Date().getTime() + 60 * 60 * 1000);

        // If the top cards has been seen before and the next review is over an hour, remove it.
        if (
            this.queue[0].neverSeen !== 1 && 
            isAfter(this.queue[0].reviewAt, oneHourFromNow)
        ) {
            this.cards = this.cards.filter(card => card.id !== this.queue[0].id);
        };

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
        if (card.getIsLearning()) {
            if (card.step === 1 && grade === 'Hard') {
                card.step = 2;
            } else if (card.step === 1 && grade === 'Good') {
                card.step = 3;
            } else if (grade === 'Again') {
                card.step = 1;
            } else if (grade === 'Good') {
                card.step = card.step + 1;
                if (card.step === this.steps.length) {
                    card.setIsLearning(false);
                    card.setReviewAt(addDays(new Date(), card.interval));
                };
            } else if (grade === 'Easy') {
                card.setIsLearning(false);
                card.setReviewAt(addDays(new Date(), card.interval * 4));
            } else if (grade !== 'Hard') {
                throw new Error('Unexpected value received for grade');
            }

            // Currently set to add seconds to prevent in from not being displayed as a review card during session
            if (card.getIsLearning()) card.setReviewAt(addMinutes(new Date(), this.steps[card.step - 1]));
            return card;
        }
        
        this.updateReviewCard(grade, card);
        return card;
    }


    private updateReviewCard(grade: string, card: Card): void {
        if (grade === 'Again') {
            card.ease = Math.max(card.ease * 0.8, 1300);
            card.setIsLearning(true);
            card.step = 1;
            card.setReviewAt(addMinutes(new Date(), 10));
            return;
        }
        if (grade === 'Easy') {
            card.ease = card.ease * 1.15;
        }
        if (grade === 'Hard') {
            card.ease = Math.max(card.ease * 0.85, 1300);
        }
        
        card.interval = card.interval * (card.ease / 1000);
        card.setReviewAt(addDays(new Date(), card.interval));
    }
}