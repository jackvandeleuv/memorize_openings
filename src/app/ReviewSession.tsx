'use client';

import React, { useEffect, useState, useCallback, HtmlHTMLAttributes } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestError, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import Button from './Button';
import { Card } from './Card';
import { Scheduler } from './Scheduler';
import { Chess } from 'chess.js';
import { addMinutes } from 'date-fns';
import { DeckInfo, PageOption } from './learn';
import RatingButton from './RatingButton';
import { NextFetchEvent } from 'next/server';

interface CardsRow {
    ease: number;       
    interval: number;   
    is_new: number;    
    step: number;       
    review_at: Date;
	lines: LinesRow | LinesRow[] | null;
	id: number;
	decks_id: number;
	never_seen: number;
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

interface ResetResponseRow {
	id: number;
	last_reset: Date;
}

export interface Position {
	move: number;
	line: string[];
	answer: string;
	game: Chess;
	eco: string;
	name: string;
	guess: Guess;
}

export interface Guess {
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
	setActivePage: React.Dispatch<React.SetStateAction<PageOption>>;
	deckIdOptions: Map<number, DeckInfo>;
	setDeckIdOptions: React.Dispatch<React.SetStateAction<Map<number, DeckInfo>>>;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ids, setActivePage, deckIdOptions, setDeckIdOptions}) => {
	const defaultPosition = {
		move: 0, 
		line: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'], 
		answer: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1', 
		game: new Chess(), 
		name: 'No Cards Due', 
		eco: '',
		guess: {row: '', col: '', color: ''}
	};

	const [position, setPosition] = useState<Position>(defaultPosition);
	const [scheduler, setScheduler] = useState<Scheduler>(new Scheduler(20));
	const [ifGradeTimes, setIfGradeTimes] = useState<IfGradeTimes>({Easy: 'N/A',  Good: 'N/A', Hard: 'N/A', Again: 'N/A'});
	const [ratingHelpMessage, setRatingHelpMessage] = useState<string>('');
	const [storedPosition, setStoredPosition] = useState<Position>();
	const [solutionToggled, setSolutionToggled] = useState<boolean>(false);

	useEffect(() => {
		const fetchCards = async () => {
			const { data: updateData, error: updateError } = await supabaseClient
				.rpc('update_new_card_limit');
			if (updateError) {
				console.error(updateError);
				return;
			};

			const { data: limitData, error: limitError } = await supabaseClient
				.from('new_card_limits')
				.select('remaining_cards')
				.in('decks_id', ids);
			if (limitError) {
				console.error(limitError);
				return;
			};
			let totalNew = 0
			for (let row of limitData) {
				totalNew = totalNew + row.remaining_cards;
			}

			// Request all new cards data from the API
			const { data: newCardData, error: newCardError} = await supabaseClient
				.from('cards')
				.select(`
					id,
					ease, 
					interval, 
					is_new, 
					step, 
					review_at,
					lines(id, name, eco),
					decks_id,
					never_seen
				`)
				.in('decks_id', ids)
				.eq('is_new', 1)
				.limit(totalNew);
			if (newCardError) { 
				console.error('error', newCardError);
				throw new Error('Supabase returned error!');
			};

			// Request all review cards data from the API
			const { data: revCardData, error: revCardError} = await supabaseClient
				.from('cards')
				.select(`
					id,
					ease, 
					interval, 
					is_new, 
					step, 
					review_at,
					lines(id, name, eco),
					decks_id,
					never_seen
				`)
				.in('decks_id', ids)
				.gte('review_at', new Date().toISOString());
			if (revCardError) { 
				console.error('error', newCardError);
				throw new Error('Supabase returned error!');
			};

			// Format the data so it can be inserted into Cards and the Scheduler
			const cards = new Map<number, Card>();

			while (newCardData.length > 0 || revCardData.length > 0) {
				let cardsRow: CardsRow;
				if (newCardData.length > 0) cardsRow = newCardData.pop()!;
				else cardsRow = revCardData.pop()!;

				// If there are no associated moves, ignore this card.
				if (!cardsRow.lines) continue;

				const card = new Card(
					cardsRow.ease, 
					cardsRow.interval, 
					cardsRow.is_new === 1, 
					cardsRow.step, 
					new Date(cardsRow.review_at),
					cardsRow.id,
					cardsRow.decks_id,
					cardsRow.never_seen
				);
				
				const lines = cardsRow.lines
				// Cards and lines is one-to-many, so this case won't occur.
				if (lines instanceof Array) {
					throw new Error('Multiple lines returned for one card.');
				};
				card.setEco(lines.eco);
				card.setName(lines.name)
				card.setLinesId(lines.id)
				cards.set(lines.id, card)
			}

			// Add cards to scheduler
			const scheduler = new Scheduler(totalNew);
			for (let key of Array.from(cards.keys())) {
				scheduler.addCard(cards.get(key)!);
			}
			scheduler.updateQueue();
			scheduler.setReviewQueueSize(getReviewCards());
			scheduler.setNewQueueSize(getNewCards());
			setScheduler(scheduler);
		}
		
		fetchCards();
	}, [ids]);  


	function getNewCards(): number {
		let newCards = 0;
		for (let id of ids) {
			const deck = deckIdOptions.get(id)!;
			newCards = newCards + deck.newDue;
		}
		return newCards;
	}


	function getReviewCards(): number {
		let reviewCards = 0;
		for (let id of ids) {
			const deck = deckIdOptions.get(id)!;
			reviewCards = reviewCards + deck.reviewDue;
		}
		return reviewCards;
	}


	const renderCards = useCallback(() => {
		const fetchCard = async () => {
			if (!scheduler) return;
			if (!scheduler.hasNextCard()) {
				setPosition(defaultPosition);
				setIfGradeTimes({Easy: 'N/A',  Good: 'N/A', Hard: 'N/A', Again: 'N/A'});
				return;
			};
			const nextCard = await scheduler.getNextCard();
			if (!nextCard || !nextCard.hasMoves()) {
				console.error('Did not fetch next card successfully.');
				setPosition(defaultPosition);
				setIfGradeTimes({Easy: 'N/A',  Good: 'N/A', Hard: 'N/A', Again: 'N/A'});
				return;
			}
	
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
			newGame.load(nextMoveFensBlind[nextMoveFensBlind.length - 1])
	
			setPosition({
				line: nextMoveFensBlind, 
				move: nextMoveFensBlind.length - 1,
				answer: nextAnswer,
				game: newGame,
				eco: nextCard.eco,
				name: nextCard.name,
				guess: {row: '', col: '', color: ''}
			});
			setStoredPosition(undefined);
		};

		fetchCard();
	}, [scheduler]);
	  

	useEffect(() => {
		renderCards();
	}, [renderCards]);
	  

	const arrowButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!scheduler || solutionToggled) return;

		if (e.currentTarget.id === '>' && position.move < position.line.length - 1) {; 
			setPosition({
				line: [...position.line], 
				move: position.move + 1, 
				answer: position.answer, 
				game: new Chess(position.game.fen()),
				eco: position.eco,
				name: position.name,
				guess: position.guess
			});
		}
		if (e.currentTarget.id === '<' && position.move > 0) {
			setPosition({
				line: [...position.line], 
				move: position.move - 1, 
				answer: position.answer, 
				game: new Chess(position.game.fen()),
				eco: position.eco,
				name: position.name,
				guess: position.guess
			});
		}	
	}


	const backButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setActivePage(PageOption.DeckPicker);
	};


	const ratingButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!scheduler) return;
		if (position.guess.color === '') {
			setRatingHelpMessage('Make a move to see the answer!');
			return;
		} else {
			setRatingHelpMessage('');
		}

		// Remove the guess highlight
		const positionCopy = deepCopyPosition(position);
		positionCopy.guess.color = '';
		setPosition(positionCopy);
		setSolutionToggled(false);

		const updatedScheduler = scheduler.deepCopy();

		// Update the db with updated card info.
		let result: boolean;
		if (e.currentTarget.id === 'Easy') {
			result = await updatedScheduler.answerCard('Easy');
		} else if (e.currentTarget.id === 'Good') {
			result = await updatedScheduler.answerCard('Good')
		} else if (e.currentTarget.id === 'Hard') {
			result = await updatedScheduler.answerCard('Hard')
		} else if (e.currentTarget.id === 'Again') {
			result = await updatedScheduler.answerCard('Again')
		} else {
			throw new Error('Unknown rating button id');
		}
		if (!result) console.error('Rating card failed to write to database.');
		
		setScheduler(updatedScheduler);
	}


	function deepCopyPosition(original: Position): Position {
		return {
			move: original.move,
			line: [...original.line],
			answer: original.answer,
			game: new Chess(original.game.fen()),
			name: original.name,
			eco: original.eco,
			guess: {
				row:position.guess.row, 
				col:position.guess.col, 
				color:position.guess.color
			}
		};
	};


	const handleShowSolution = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (solutionToggled) {
			const storedPositionCopy = deepCopyPosition(storedPosition!);
			setPosition(storedPositionCopy);
			setStoredPosition(undefined);
			setSolutionToggled(!solutionToggled);
			return;
		};
	
		// Store current position in solution toggle
		const positionCopy = deepCopyPosition(position);
		setStoredPosition(positionCopy);

		const positionCopy2 = deepCopyPosition(position);

		positionCopy2.line.push(positionCopy2.answer);
		positionCopy2.game.load(positionCopy2.answer);
		positionCopy2.move = positionCopy2.line.length - 1;
		setPosition(positionCopy2);
		setSolutionToggled(!solutionToggled);
	};


	useEffect(() => {
		const setSchedulerCardCounts = () => {
			let newCards = 0;
			for (let id of ids) {
				const deck = deckIdOptions.get(id)!;
				newCards = newCards + deck.newDue;
			}
			let reviewCards = 0;
			for (let id of ids) {
				const deck = deckIdOptions.get(id)!;
				reviewCards = reviewCards + deck.reviewDue;
			};
			const updatedScheduler = scheduler.deepCopy();
			updatedScheduler.setNewQueueSize(newCards);
			updatedScheduler.setReviewQueueSize(reviewCards);
			setScheduler(updatedScheduler);
		};
		setSchedulerCardCounts();
	}, [deckIdOptions, ids]);
	

	return (
		<div className="w-full bg-indigo-400">
			<div className="w-full flex flex-col md:flex-row md:pb-10 justify-center gap-4">
				<div className="w-full h-full md:ml-64 md:px-8 flex flex-col bg-indigo-500 md:rounded-lg">	
					
					<div className="py-4 md:pt-6 px-1 md:px-6 text-center text-xl md:text-2xl font-bold text-white">
						{position.name}
					</div>		
					
					<div className="flex justify-center items-center sm:px-16 md:px-4 md:pb-4">
						{position.line && position.line.length > 0 &&				
							<ChessBoard
								solutionToggled={solutionToggled}
								position={position}
								setPosition={setPosition}
							/>
						}
					</div>
			
					<div className="flex flex-row justify-center items-center">
						<RatingButton
							id="Again"
							time={ifGradeTimes.Again}
							handleClick={ratingButtonClick}
						>
							{'Again'}
						</RatingButton>
	
						<RatingButton
							id="Hard"
							time={ifGradeTimes.Hard}
							handleClick={ratingButtonClick}
						>
							{'Hard'}
						</RatingButton>
	
						<RatingButton
							id="Good"
							time={ifGradeTimes.Good}
							handleClick={ratingButtonClick}
						>
							{'Good'}
						</RatingButton>
	
						<RatingButton
							id="Easy"
							time={ifGradeTimes.Easy}
							handleClick={ratingButtonClick}
						>
							{'Easy'}
						</RatingButton>
					</div>
				</div>

	
				<div className="flex flex-col md:mr-64 pb-4 sm:px-4 items-center space-y-4">
					<div className="w-full pt-2 bg-indigo-500 sm:rounded-lg">
						<div className="flex justify-center p-1 sm:px-8 rounded-lg">
							<Button
								id='solution'
								handleClick={handleShowSolution}
								color={'bg-indigo-400'}
							>
								{solutionToggled ? 'Hide Solution' : 'Show Solution'}
							</Button>
						</div>

						<div className="flex justify-center py-2 space-x-4 rounded-lg">
							<Button
								id='<'
								handleClick={arrowButtonClick}
								color={'bg-indigo-400'}
							>
								{'<'}
							</Button>
							<Button
								id='>'
								handleClick={arrowButtonClick}
								color={'bg-indigo-400'}
							>
								{'>'}
							</Button>
						</div>
		
						<div className="flex justify-center pb-4 rounded-lg">
							<Button 
								id='back'
								handleClick={backButtonClick}
								color={'bg-indigo-400'}
							>
								{'Back'}
							</Button>
						</div>
					</div>

					<div className="w-full py-4 px-16 md:px-8 bg-indigo-500 sm:rounded-lg">
						<div className="text-center text-xl font-bold text-white">
							{position.game.turn() === 'w' && !solutionToggled ? 'White to Move' : 'Black to Move'}
						</div>
						
						<div className="flex flex-col py-4 w-full">
							<div className="p-1 text-center text-lg font-bold text-white bg-indigo-300">
								{`New: ${scheduler.getNewQueueSize()}`}
							</div>
							<div className="p-1 text-center text-lg font-bold text-white bg-indigo-400">
								{`Review: ${scheduler.getReviewQueueSize()}`}
							</div>
						</div>

						<div className="text-white text-1xl pb-3 flex justify-center font-bold rounded-lg">
							{ratingHelpMessage}
						</div>
					</div>
					
				</div>

			</div>
		</div>
	);
	
	
}

export default ReviewSession;