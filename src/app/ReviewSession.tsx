'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestError, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import Button from './Button';
import { Card } from './Card';
import { Scheduler } from './Scheduler';
import { Chess } from 'chess.js';
import { addMinutes } from 'date-fns';

interface CardsRow {
    ease: number;       
    interval: number;   
    is_new: number;    
    step: number;       
    review_at: Date;
	lines: LinesRow | LinesRow[] | null;
}

export interface ChessMove {
	lines_id: number;
    order_in_line: number;
    fen: string;
}

interface LinesRow {
	name: string;
	eco: string;
	id: number;
}

export interface Position {
	move: number;
	line: string[];
	answer: string;
	game: Chess;
	eco: string;
	name: string;
}

export interface AnswerToggle {
	row: string,
	col: string,
	color: string
}

interface IfGradeTimes {
	Easy: string;
	Good: string;
	Hard: string;
	Again: string;
}

interface ReviewSessionProps {
	ids: number[];
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ids}) => {
	const [position, setPosition] = useState<Position>({
		move: 0, 
		line: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'], 
		answer: '', 
		game: new Chess(), 
		name: 'No Cards Due', 
		eco: ''
	})
	const [scheduler, setScheduler] = useState<Scheduler>(new Scheduler());
	const [answerToggle, setAnswerToggle] = useState<AnswerToggle>({row: '', col: '', color: ''});
	const [ifGradeTimes, setIfGradeTimes] = useState<IfGradeTimes>({Easy: '',  Good: '', Hard: '', Again: ''});


	useEffect(() => {
		const fetchCards = async () => {
			// Request all cards and lines data from the API
			const cardsResponse = await supabaseClient.from('cards')
				.select(`
					ease, 
					interval, 
					is_new, 
					step, 
					review_at,
					lines(id, name, eco)
				`)
				.in('decks_id', ids)
			
			// Unpack the data returned by the API
			const data: CardsRow[] | null = cardsResponse.data;
			const error: PostgrestError | null = cardsResponse.error;
			if (error) { 
				console.error('error', error);
				throw new Error('Supabase returned error!');
			};
			console.log(data)

			// Format the data so it can be inserted into Cards and the Scheduler
			const cards = new Map<number, Card>();
			for (let cardsRow of data!) {
				console.log('cardsRow:\n' + cardsRow.lines)
				// Temporarily set date to current time plus 10,000 millis
				console.log('Manually setting review time to now!!!');
				const dummyDate = new Date();
				dummyDate.setTime(dummyDate.getTime() + 10000)

				// If there are no associated moves, ignore this card.
				if (!cardsRow.lines) {
					console.log('Card had no associated line.');
					continue;
				}

				const card = new Card(
					cardsRow.ease, 
					cardsRow.interval, 
					cardsRow.is_new === 1, 
					cardsRow.step, 
					dummyDate);
				
				const lines = cardsRow.lines
				// Cards and lines is one-to-many, so this case won't occur.
				if (lines instanceof Array) throw new Error('Multiple lines returned for one card.')
				card.setEco(lines.eco);
				card.setName(lines.name)
				card.setLinesId(lines.id)
				cards.set(lines.id, card)
			}

			const movesResponse = await supabaseClient.from('moves')
				.select('lines_id, fen, order_in_line')
				.in('lines_id', Array.from(cards.keys()));
			
			// Unpack the data returned by the API
			const movesData: ChessMove[] | null = movesResponse.data;
			const movesError: PostgrestError | null = movesResponse.error;
			if (movesError) { 
				console.error('error', movesError);
				return;
			};
			if (!movesData) {
				console.log('No moves associated with cards.');
				return;
			};

			for (let move of movesData) {
				if (!move) continue;
				const card = cards.get(move.lines_id);
				if (card) card.addMove(move);
			}

			console.log('Cards in map after fetch cards:')
			for (let key of Array.from(cards.keys())) {
				console.log(cards.get(key)!.toString())
			}

			// Add cards to scheduler
			const scheduler = new Scheduler();
			for (let key of Array.from(cards.keys())) {
				scheduler.addCard(cards.get(key)!);
			}
			scheduler.updateQueue();
			setScheduler(scheduler);
		}
		
		fetchCards();
	}, [])


	const renderCards = useCallback(() => {
		if (!scheduler) return;
		if (!scheduler.hasNextCard()) {
			console.log('!scheduler.hasNextCard() -> return');
			return;
		}
		const nextCard = scheduler.getNextCard()!;

		if (!nextCard.hasMoves()) {
			console.log('Next card has no moves. nextCard: ' + nextCard);
			return;
		}
		console.log('Next card: ' + nextCard + ' Moves: ' + nextCard!.printMoves())

		setIfGradeTimes({
			Easy: scheduler.resultIfGrade('Easy'),
			Good: scheduler.resultIfGrade('Good'),
			Hard: scheduler.resultIfGrade('Hard'),
			Again: scheduler.resultIfGrade('Again')
		})

		const nextMoves = nextCard.getMoves();
		const nextMoveFens = nextMoves.map(move => move.fen);
		const nextAnswer = nextMoveFens[nextMoveFens.length - 1];
		const nextMoveFensBlind = nextMoveFens.slice(0, nextMoveFens.length - 1)

		const newGame = new Chess();
		console.log('nextMoveFensBlind: ' + nextMoveFensBlind)
		newGame.load(nextMoveFensBlind[nextMoveFensBlind.length - 1])

		setPosition({
			line: nextMoveFensBlind, 
			move: nextMoveFensBlind.length - 1,
			answer: nextAnswer,
			game: newGame,
			eco: nextCard.eco,
			name: nextCard.name
		});
	}, [scheduler]);
	  

	useEffect(() => {
		renderCards();
	}, [renderCards]);
	  

	const arrowButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!scheduler) return;

		console.log('In queue currently:\n')
		for (let card of scheduler.getQueue()) {
			console.log(card.toString())
		}

		if (e.currentTarget.id === '>' && position.move < position.line.length - 1) {
			const newIndex = position.move + 1;
			const currentLine = [...position.line];
			setPosition({
				line: currentLine, 
				move: newIndex, 
				answer: position.answer, 
				game: new Chess(position.game.fen()),
				eco: position.eco,
				name: position.name
			});
		}
		if (e.currentTarget.id === '<' && position.move > 0) {
			const newIndex = position.move - 1;
			const currentLine = [...position.line];
			setPosition({
				line: currentLine, 
				move: newIndex, 
				answer: position.answer, 
				game: new Chess(position.game.fen()),
				eco: position.eco,
				name: position.name			
			});
		}	
	}


	const ratingButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!scheduler) return;
		const updatedScheduler = scheduler.deepCopy();
		if (e.currentTarget.id === '!!') updatedScheduler.answerCard('Easy');
		if (e.currentTarget.id === '!?') updatedScheduler.answerCard('Good');
		if (e.currentTarget.id === '?!') updatedScheduler.answerCard('Hard');
		if (e.currentTarget.id === '??') updatedScheduler.answerCard('Again');
		setScheduler(updatedScheduler);
		setAnswerToggle({row: answerToggle.row, col: answerToggle.col, color: ''});
	}


	return (
		<div className="flex flex-col items-center space-y-6">
			<h2 className="text-2xl font-bold">
				{position.eco + ' ' + position.name}
			</h2>
	
			<h3 className="text-xl">
				{position.game.turn() === 'w' ? 'White to Move' : 'Black to Move'}
			</h3>

			<h3>
				{'To Learn:\nNew: ' + scheduler.newQueueSize() + '\nReview: ' + (scheduler.queueSize() - scheduler.newQueueSize())}
			</h3>
	
			{position.line && position.line.length > 0 &&				
				<div className="flex justify-center p-4 border-2 border-gray-200 rounded-lg">
					<ChessBoard
						position={position}
						setPosition={setPosition}
						answerToggle={answerToggle}
						setAnswerToggle={setAnswerToggle}
					/>
				</div>
			}
	
			<div className="flex justify-center space-x-4">
				<Button
					id='<'
					handleClick={arrowButtonClick}
				>
					{'<'}
				</Button>
				<Button
					id='>'
					handleClick={arrowButtonClick}
				>
					{'>'}
				</Button>
			</div>
	
			<div className="flex justify-center space-x-4 p-4 bg-white shadow rounded-lg">
				<div className="p-2">{ifGradeTimes.Again}</div>
				<div className="p-2">{ifGradeTimes.Hard}</div>
				<div className="p-2">{ifGradeTimes.Good}</div>
				<div className="p-2">{ifGradeTimes.Easy}</div>
			</div>
	
			<div className="flex justify-center space-x-4 p-4 bg-white shadow rounded-lg">
				<Button
					id='??'
					handleClick={ratingButtonClick}
				>
					{'??'}
				</Button>
				<Button
					id='?!'
					handleClick={ratingButtonClick}
				>
					{'?!'}
				</Button>
				<Button
					id='!?'
					handleClick={ratingButtonClick}
				>
					{'!?'}
				</Button>
				<Button
					id='!!'
					handleClick={ratingButtonClick}
				>
					{'!!'}
				</Button>
			</div>
		</div>
	);
	
}

export default ReviewSession;