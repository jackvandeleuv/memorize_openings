import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { ChessMove } from './ReviewSession';

export class Card {
    moves: ChessMove[] | null = null;
    ease: number;
    interval: number;
    isNew: boolean;
    step: number;
    private reviewAt: Date;
    private id: number;

    constructor(ease: number, interval: number, isNew: boolean, step: number, reviewAt: Date) {
        this.ease = ease;
        this.interval = interval;
        this.isNew = isNew;
        this.step = step;
        this.reviewAt = reviewAt;
        this.id = Math.floor(Math.random() * (10000 - 1) + 1);;
    }

    setReviewAt(newReviewAt: Date): void {
        this.reviewAt = new Date(newReviewAt.getTime());
    }

    getReviewAt(): Date {
        return new Date(this.reviewAt.getTime());
    } 

    deepCopy(): Card {
        const cardCopy =  new Card(
            this.ease,
            this.interval,
            this.isNew,
            this.step,
            new Date(this.reviewAt.getTime())
        )
        cardCopy.id = this.id;
        return cardCopy;
    }

    hasMoves(): boolean {
        return this.moves == null;
    }

    setMoves(moves: ChessMove[]): void {
        this.moves = moves;
    }

    toString(): string {
        return (
            'Card: ' + this.id +
            ', Review: ' + this.reviewTime() +
            ', Ease: ' + this.ease +
            ', New: ' + this.isNew +
            ', Step: ' + this.step
        );
    }
    
    reviewTime(): string {
        return formatDistanceToNow(this.reviewAt);
    }
}