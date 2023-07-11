import { formatDistanceToNow } from 'date-fns';
import { ChessMove } from './ReviewSession';

export class Card {
    private moves: ChessMove[] = [];
    ease: number;
    interval: number;
    isLearning: boolean;
    step: number;
    reviewAt: Date;
    lines_id: number = -1;
    id: number;
    name: string = '';
    eco: string = '';
    decks_id: number;
    neverSeen: number;

    constructor(
        ease: number, 
        interval: number, 
        isNew: boolean, 
        step: number, 
        reviewAt: Date, 
        newId: number,
        decks_id: number,
        never_seen: number
    ) {
        this.ease = ease;
        this.interval = interval;
        this.isLearning = isNew;
        this.step = step;
        this.reviewAt = reviewAt;
        this.id = newId;
        this.decks_id = decks_id;
        this.neverSeen = never_seen
    }


    setLinesId(lines_id: number) {
        this.lines_id = lines_id;
    }


    getMaxOrderInLine(): number {
        if (this.moves.length === 0) return 0;
        return this.moves[this.moves.length - 1].order_in_line;
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
            this.isLearning,
            this.step,
            new Date(this.reviewAt.getTime()),
            this.id,
            this.decks_id,
            this.neverSeen
        );
        cardCopy.moves = [...this.moves];
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
        const moveData = this.moves.map(move => '\n' + move.order_in_line + ': ' + move.fen) 
        return (
            'Card: ' + this.id +
            ', Review: ' + this.reviewTime() +
            ', Ease: ' + this.ease +
            ', New: ' + this.isLearning +
            ', Step: ' + this.step + 
            ', Moves: ' + moveData
        );
    }
    
    reviewTime(): string {
        let time = formatDistanceToNow(this.reviewAt);
        time = time.replace('less than a minute', '1 min')
        time = time.replace('minute', 'min');
        return time.replace('1 min', '< 1 min')
    }
}