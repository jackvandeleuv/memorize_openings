import { Scheduler } from './Scheduler';
import { Card } from './Card';
import { isAfter } from 'date-fns';

jest.useFakeTimers();

describe('Scheduler tests', () => {
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
        card1.addMove({fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})
        card2 = new Card(ease, interval, true, step, new Date());
        card2.addMove({fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 1, lines_id: 1})
        card3 = new Card(ease, interval, false, step, new Date());
        card3.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 2, lines_id: 1})
        card4 = new Card(ease, interval, false, step, new Date());
        card4.addMove({fen: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', order_in_line: 2, lines_id: 1})
        card5 = new Card(ease, interval, true, step, new Date());
    });


    test('cards with no moves should be ignored', () => {
        expect(scheduler.addCard(card1)).toBe(true);
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
        expect(scheduler.queueSize()).toBe(4);
        expect(scheduler.newQueueSize()).toBe(2);
    });


    test('easy should immediately graduate a card to review', () => {
        scheduler.addCard(card1);
        scheduler.addCard(card2);
        scheduler.updateQueue();
        expect(scheduler.queueSize()).toBe(2);
        expect(scheduler.newQueueSize()).toBe(2);
        scheduler.answerCard('Easy');
        expect(scheduler.queueSize()).toBe(1);
        expect(scheduler.newQueueSize()).toBe(1);
    });


    test('after default creation, review times should be 1m/6m/10m/4ds', () => {
        scheduler.addCard(card1);
        scheduler.updateQueue();
        expect(scheduler.resultIfGrade('Again')).toBe('1 minute');
        expect(scheduler.resultIfGrade('Hard')).toBe('6 minutes');
        expect(scheduler.resultIfGrade('Good')).toBe('10 minutes');
        expect(scheduler.resultIfGrade('Easy')).toBe('4 days');
        scheduler.answerCard('Easy');
        expect(scheduler.queueSize()).toBe(0);
        expect(scheduler.newQueueSize()).toBe(0);
    });


    test('easy card should actually be served up after two days', () => {
        scheduler.addCard(card1);
        scheduler.updateQueue();
        expect(scheduler.queueSize()).toBe(1);
        expect(scheduler.newQueueSize()).toBe(1);
        scheduler.answerCard('Easy');
        // Slightly less than two days
        jest.advanceTimersByTime(86400000 * 3 + 86400000 * .99);
        scheduler.updateQueue();
        console.log(scheduler.getNextCard()?.reviewTime());
        expect(scheduler.queueSize()).toBe(0);
        expect(scheduler.newQueueSize()).toBe(0);
        jest.advanceTimersByTime(86400000 * .02);
        scheduler.updateQueue();
        expect(scheduler.queueSize()).toBe(1);
        expect(scheduler.newQueueSize()).toBe(0);
    });


    beforeEach(() => {

    });




});


//   test('should update queue', () => {
//     scheduler.addCard(card1);
//     scheduler.addCard(card2);
//     scheduler.updateQueue();
//     expect(scheduler.queue.length).toBe(2);
//   });

//   test('should answer card', () => {
//     scheduler.addCard(card1);
//     scheduler.updateQueue();
//     const result = scheduler.answerCard('Good');
//     expect(result).toBeTruthy();
//   });

//   test('should handle empty queue on answerCard', () => {
//     const result = scheduler.answerCard('Good');
//     expect(result).toBeFalsy();
//   });

//   test('should return not found when no cards in queue', () => {
//     const result = scheduler.resultIfGrade('Good');
//     expect(result).toBe('Not found.');
//   });

//   // Add more tests here for different methods and edge cases
// });
