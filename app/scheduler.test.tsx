import { Scheduler } from './Scheduler';
import { Card } from './Card';
import { isAfter } from 'date-fns'; 

jest.useFakeTimers();
 

describe('Card scheduling tests', () => {
    let scheduler: Scheduler;
    let card1: Card;
    let card2: Card;
    let card3: Card;
    let card4: Card;
    let card5: Card;

    beforeEach(() => {

    });


    test('cards with one or fewer should be ignored', () => {
        expect(scheduler.addCard(card1)).toBe(true);

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
});