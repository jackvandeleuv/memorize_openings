import { Scheduler } from './Scheduler';
import { Card } from './Card';
import { isAfter } from 'date-fns'; 

jest.useFakeTimers();

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let temporaryValue: T;
    let randomIndex: number;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
  

describe('Card scheduling tests', () => {
    let scheduler: Scheduler;
    let card1: Card;
    let card2: Card;
    let card3: Card;
    let card4: Card;
    let card5: Card;

    beforeEach(() => {
        const ease = 2500;
        const interval = 1;
        const step = 2;
        scheduler = new Scheduler();
        card1 = new Card(ease, interval, true, step, new Date());
        card1.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 2, lines_id: 1})
        card1.addMove({fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})
        
        card2 = new Card(ease, interval, false, step, new Date());
        card2.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 2, lines_id: 1})
        card2.addMove({fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})

        card3 = new Card(ease, interval, false, step, new Date());
        card3.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})
        card3.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 2, lines_id: 1})

        card4 = new Card(ease, interval, true, step, new Date());
        card4.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})
        
        card5 = new Card(ease, interval, true, step, new Date());
        card5.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 99, lines_id: 1});
        card5.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 77, lines_id: 1});

    });


    test('cards with one or fewer should be ignored', () => {
        expect(scheduler.addCard(card1)).toBe(true);
        expect(scheduler.addCard(card2)).toBe(true);
        expect(scheduler.addCard(card3)).toBe(true);
        expect(scheduler.addCard(card4)).toBe(false);
        expect(scheduler.addCard(card5)).toBe(false);
    });


    test('queue size should reflect the number of cards added', () => {
        scheduler.addCard(card1);
        scheduler.addCard(card2);
        scheduler.addCard(card3);
        scheduler.addCard(card4);
        scheduler.addCard(card5);

        // One day
        jest.advanceTimersByTime(86400000);
        scheduler.updateQueue();
        expect(scheduler.getReviewQueueSize()).toBe(3);
        expect(scheduler.getNewQueueSize()).toBe(1);
    });


    test('easy should immediately graduate a card to review', () => {
        scheduler.addCard(card1);
        scheduler.addCard(card2);
        jest.advanceTimersByTime(100000);
        scheduler.updateQueue();

        expect(scheduler.getReviewQueueSize()).toBe(2);
        expect(scheduler.getNewQueueSize()).toBe(1);

        scheduler.answerCard('Easy');

        expect(scheduler.getReviewQueueSize()).toBe(1);
        expect(scheduler.getNewQueueSize()).toBe(0);
    });


    test('after default creation, review times should be 1m/6m/10m/4ds', () => {
        scheduler.addCard(card1);
        scheduler.updateQueue();
        expect(scheduler.resultIfGrade('Again')).toBe('1 minute');
        expect(scheduler.resultIfGrade('Hard')).toBe('6 minutes');
        expect(scheduler.resultIfGrade('Good')).toBe('10 minutes');
        expect(scheduler.resultIfGrade('Easy')).toBe('4 days');
        scheduler.answerCard('Easy');
        expect(scheduler.getReviewQueueSize()).toBe(0);
        expect(scheduler.getNewQueueSize()).toBe(0);
    });


    test('easy card should actually be served up after two days', () => {
        scheduler.addCard(card1);
        scheduler.updateQueue();
        expect(scheduler.getReviewQueueSize()).toBe(1);
        expect(scheduler.getNewQueueSize()).toBe(1);
        scheduler.answerCard('Easy');
        // Slightly less than two days
        jest.advanceTimersByTime(86400000 * 3 + 86400000 * .99);
        scheduler.updateQueue();
        console.log(scheduler.getNextCard()?.reviewTime());
        expect(scheduler.getReviewQueueSize()).toBe(0);
        expect(scheduler.getNewQueueSize()).toBe(0);
        jest.advanceTimersByTime(86400000 * .02);
        scheduler.updateQueue();
        expect(scheduler.getReviewQueueSize()).toBe(1);
        expect(scheduler.getNewQueueSize()).toBe(0);
    });


});


describe('Cards should be added correctly', () => {
    let card1: Card;
    let card2: Card;
    let moves: any[];

    beforeAll(() => {
        moves = [
            [590002, 1, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'],
            [590002, 2, 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'],
            [590002, 3, 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'],
            [590002, 4, 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'],
            [590002, 5, 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'],
            [635003, 1, 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'],
            [635003, 2, 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'],
            [635003, 3, 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'],
            [635003, 4, 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'],
            [635003, 5, 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3'],
            [635003, 6, 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'],
            [635003, 7, 'r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4']
        ]
        moves = shuffle(moves);
        card1 = new Card(2500, 1, true, 1, new Date());
        card2 = new Card(2500, 1, true, 1, new Date());
    });

    test('Add moves works', () => {
        for (let move of moves) {
            if (move[0] === 590002) {
                card1.addMove({lines_id: move[0], order_in_line: move[1], fen: move[2]}); 
            }
            else {
                card2.addMove({lines_id: move[0], order_in_line: move[1], fen: move[2]}); 
            }
        }
    });

});