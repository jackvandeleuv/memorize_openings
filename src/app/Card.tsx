import { addMinutes, addDays, isAfter, formatDistanceToNow } from 'date-fns';
import { ChessMove } from './ReviewSession';

export class Card {
    private moves: ChessMove[] = [];
    ease: number;
    interval: number;
    isNew: boolean;
    step: number;
    reviewAt: Date;
    lines_id: number = -1;
    id: number;
    name: string = '';
    eco: string = '';

    constructor(ease: number, interval: number, isNew: boolean, step: number, reviewAt: Date) {
        this.ease = ease;
        this.interval = interval;
        this.isNew = isNew;
        this.step = step;
        this.reviewAt = reviewAt;
        this.id = Math.floor(Math.random() * (10000 - 1) + 1);
    }

    setLinesId(lines_id: number) {
        this.lines_id = lines_id;
    }

    printMoves(): void {
        if (this.moves.length === 0) console.log('No moves to print.')
        for (let move of this.moves) {
            console.log(move.lines_id + ': Order: ' + move.order_in_line + ' FEN: ' + move.fen + '\n')
        }
    }

    getMoves(): ChessMove[] {
        return [...this.moves];
    }

    setName(name: string) {
        this.name = name!;
    }

    setEco(eco: string) {
        this.eco = eco!;
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
        cardCopy.moves = this.moves;
        cardCopy.lines_id = this.lines_id;
        cardCopy.name = this.name;
        cardCopy.eco = this.eco;
        return cardCopy;
    }

    hasMoves(): boolean {
        return this.moves.length > 1;
    }

    // Add move using insertion sort
    addMove(newMove: ChessMove) {
        if (!newMove) {
            console.log('addMove did not find a valid move');
            return;
        };
        if (this.moves.length == 0) {
            this.moves.push(newMove);
            return;
        }
        let i = this.moves.length - 1;
        while (i >= 0 && this.moves[i].order_in_line > newMove.order_in_line) {
            this.moves[i + 1] = this.moves[i];
            i--;
        }
        if (i >= 0 && this.moves[i].order_in_line == newMove.order_in_line) {
            throw new Error('Card got two moves with same order_in_line');
        }
        this.moves[i + 1] = newMove;
    }

    toString(): string {
        const moveFens = this.moves.map(move => move.fen) 
        return (
            'Card: ' + this.id +
            ', Review: ' + this.reviewTime() +
            ', Ease: ' + this.ease +
            ', New: ' + this.isNew +
            ', Step: ' + this.step + 
            ', Moves: ' + moveFens
        );
    }
    
    reviewTime(): string {
        return formatDistanceToNow(this.reviewAt);
    }
}