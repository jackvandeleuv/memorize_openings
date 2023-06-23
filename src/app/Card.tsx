import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { ChessMove } from './ReviewSession';

export class Card {
    moves: ChessMove[] | null = null;
    ease: number;
    interval: number;
    isNew: boolean;
    step: number;
    reviewAt: Date;

    constructor(ease: number, interval: number, isNew: boolean, step: number, reviewAt: Date) {
        this.ease = ease;
        this.interval = interval;
        this.isNew = isNew;
        this.step = step;
        this.reviewAt = reviewAt;
    }

    hasMoves(): boolean {
        return this.moves == null;
    }

    setMoves(moves: ChessMove[]): void {
        this.moves = moves;
    }

    toString(): string {
        return (
            'Data: ' + this.moves +
            ', Review: ' + this.reviewTime() +
            ', Ease: ' + this.ease +
            ', Inter: ' + this.interval +
            ', New: ' + this.isNew +
            ', Step: ' + this.step
        );
    }
    
    reviewTime(): string {
        return formatDistanceToNow(this.reviewAt) + ' minutes';
    }
}