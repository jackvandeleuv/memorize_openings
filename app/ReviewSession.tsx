'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ChessBoard from './components/chess/ChessBoard';
import { Card } from './Card';
import { Scheduler } from './Scheduler';
import { Chess } from 'chess.js';
import RatingButton from './components/buttons/RatingButton';
import { PageOption } from './learn/page';
import { supabaseClient } from '../utils/supabaseClient';
import SolutionButton from './components/buttons/SolutionButton';
import { BeatLoader } from 'react-spinners';
import ArrowButton from './components/buttons/ArrowButton';
import BackButton from './components/buttons/BackButton';
import DeckInfoPanel from './components/panels/DeckInfoPanel';

interface CardsRow {
    ease: number;       
    interval: number;   
    is_learning: number;    
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
	id: number;
	activePage: PageOption;
	setActivePage: React.Dispatch<React.SetStateAction<PageOption>>;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({id, activePage, setActivePage}) => {
	const defaultPosition = {
		move: 0, 
		line: ['8/8/8/8/8/8/8/8 w KQkq - 0 1'], 
		answer: '8/8/8/8/8/8/8/8 w KQkq - 0 1', 
		game: new Chess(), 
		name: 'No Cards Due', 
		eco: '',
		guess: {row: '', col: '', color: ''}
	};

	const initialPosition = {
		move: 0, 
		line: ['8/8/8/8/8/8/8/8 w KQkq - 0 1'], 
		answer: '8/8/8/8/8/8/8/8 w KQkq - 0 1', 
		game: new Chess(), 
		name: 'Cards Not Loaded', 
		eco: '',
		guess: {row: '', col: '', color: ''}
	}

	const [position, setPosition] = useState<Position>(initialPosition);
	const [scheduler, setScheduler] = useState<Scheduler>();
	const [ifGradeTimes, setIfGradeTimes] = useState<IfGradeTimes>({Easy: 'N/A',  Good: 'N/A', Hard: 'N/A', Again: 'N/A'});
	const [storedPosition, setStoredPosition] = useState<Position>();
	const [solutionToggled, setSolutionToggled] = useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const defaultMessage = ['Make a Move', "Give your best guess, and then rate yourself to decide how long to wait before you see this position again."];
	const [userMessage, setUserMessage] = useState<string[]>(defaultMessage);
	
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);


	useEffect(() => {
		setIsLoaded(scheduler !== undefined && position.name !== 'Cards Not Loaded')
	}, [scheduler, position]);


	useEffect(() => {
		const fetchCards = async () => {
			const { data: limitData, error: limitError } = await supabaseClient
				.from('new_card_limits')
				.select('remaining_cards')
				.eq('decks_id', id);
			if (limitError) { console.error(limitError); return; };

			const totalNew = limitData[0].remaining_cards

			// Request all new cards data from the API
			const { data: newCardData, error: newCardError} = await supabaseClient
				.from('cards')
				.select(`
					id,
					ease, 
					interval, 
					is_learning, 
					step, 
					review_at,
					lines(id, name, eco),
					decks_id,
					never_seen
				`)
				.eq('decks_id', id)
				.eq('never_seen', 1)
				.limit(totalNew);
			if (newCardError) { 
				console.error('error', newCardError);
				throw new Error('Supabase returned error!');
			};

			// We'll get all cards due within the next hour
			const oneHourFromNow = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();

			// Request all review cards data from the API
			const { data: revCardData, error: revCardError} = await supabaseClient
				.from('cards')
				.select(`
					id,
					ease, 
					interval, 
					is_learning, 
					step, 
					review_at,
					lines(id, name, eco),
					decks_id,
					never_seen
				`)
				.eq('decks_id', id)
				.lte('review_at', oneHourFromNow);
			if (revCardError) { 
				console.error(newCardError);
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
					cardsRow.is_learning === 1, 
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
			setScheduler(scheduler);
		}
		
		fetchCards();
	}, [id, activePage]);  


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
		setActivePage('DeckPicker');
	};


	const handleRightArrow = useCallback(
		(e: KeyboardEvent) => {
			if (!scheduler || solutionToggled) return;
			if (position.move < position.line.length - 1) {; 
				setPosition({
					line: [...position.line], 
					move: position.move + 1, 
					answer: position.answer, 
					game: new Chess(position.game.fen()),
					eco: position.eco,
					name: position.name,
					guess: position.guess
				})
			}
		}, [position, scheduler, solutionToggled]
	);

	const handleLeftArrow = useCallback(
		(e: KeyboardEvent) => {
			if (!scheduler || solutionToggled) return;
			if (position.move > 0) {; 
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
		}, [position, scheduler, solutionToggled]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
		  switch (e.key) {
			case 'ArrowLeft':
			  handleLeftArrow(e);
			  break;
			case 'ArrowRight':
			  handleRightArrow(e);
			  break;
			default:
			  break;
		  }
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
		  document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleLeftArrow, handleRightArrow]); 


	const ratingButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!scheduler) return;
		if (position.guess.color === '' && !solutionToggled) return; 

		setUserMessage(defaultMessage);

		// Remove the guess highlight
		const positionCopy = deepCopyPosition(position);
		positionCopy.guess.color = '';

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
		setPosition(positionCopy);
		setSolutionToggled(false);
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
		if (!scheduler || !scheduler.hasNextCard()) return;
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
	

	return (
		<div className="w-full sm:px-12 md:px-4 bg-slate-800 md:bg-slate-700">
			<div className="flex flex-col md:flex-row md:pb-10 justify-center md:gap-4">
				<div className="md:px-4 flex flex-col bg-slate-800 md:rounded-lg">	
					
					<div className="pt-4 px-1 sm:pt-6 sm:pb-3 text-center text-2xl sm:text-3xl font-bold text-white">
						{isLoaded ? position.name : <BeatLoader color={"#FFFFFF"} loading={!isLoaded} size={16} />}
					</div>		
					
					<div className="flex justify-center items-center sm:px-4 px-4 sm:pb-4">
						{position.line && position.line.length > 0 &&				
							<ChessBoard
								solutionToggled={solutionToggled}
								position={position}
								setPosition={setPosition}
								setUserMessage={setUserMessage}
							/>
						}
					</div>
			
					<div className="flex flex-row justify-center items-center mb-2 sm:mb-4 mx-4 gap-2">
						<div className='flex flex-grow justify-center items-center'>
							<RatingButton
								id="Again"
								time={ifGradeTimes.Again}
								handleClick={ratingButtonClick}
								position={position}
								solutionToggled={solutionToggled}
								sidePadding={'px-2'}
							>
								{'Again'}
							</RatingButton>
						</div>
						<div className='flex flex-grow justify-center items-center'>
							<RatingButton
								id="Hard"
								time={ifGradeTimes.Hard}
								handleClick={ratingButtonClick}
								position={position}
								solutionToggled={solutionToggled}
								sidePadding={'px-3'}
							>
								{'Hard'}
							</RatingButton>
						</div>

						<div className='flex flex-grow justify-center items-center'>
							<RatingButton
								id="Good"
								time={ifGradeTimes.Good}
								handleClick={ratingButtonClick}
								position={position}
								solutionToggled={solutionToggled}
								sidePadding={'px-2'}
							>
								{'Good'}
							</RatingButton>
						</div>
						<div className='flex flex-grow justify-center items-center'>
							<RatingButton
								id="Easy"
								time={ifGradeTimes.Easy}
								handleClick={ratingButtonClick}
								position={position}
								solutionToggled={solutionToggled}
								sidePadding={'px-3'}
							>
								{'Easy'}
							</RatingButton>
						</div>
					</div>
				</div>

	
				<div className="flex flex-col items-center md:w-1/4">
					<div className="px-4 md:py-4 md:mb-4 flex flex-row md:flex-col w-full bg-slate-800 sm:rounded-lg gap-2 md:gap-0">
						<div className="flex flex-grow justify-center items-center py-2 space-x-2 rounded-md">
							<ArrowButton
								id='<'
								handleClick={arrowButtonClick}
							>
								{'<'}
							</ArrowButton>
							<ArrowButton
								id='>'
								handleClick={arrowButtonClick}
							>
								{'>'}
							</ArrowButton>
						</div>
						<div className="flex flex-grow justify-center items-center sm:px-8 md:px-0 md:pt-2 md:pb-4 rounded-md">
							<SolutionButton
								id='solution'
								handleClick={handleShowSolution}
								solutionToggled={solutionToggled}
							>
								Toggle Answer
							</SolutionButton>
						</div>
						<div className="flex flex-grow justify-center items-center rounded-md">
							<BackButton 
								id='back'
								handleClick={backButtonClick}
							>
								{'Back'}
							</BackButton>
						</div>
					</div>

					<div className='flex-grow h-full justify-center md:mb-4 bg-slate-800 rounded-lg'>
						<div className='m-4 md:m-3 mt-5 md:mt-3 px-1 py-5 md:py-3 rounded-md bg-slate-700 md:bg-slate-800'>
							<div className='flex justify-center items-center text-center pb-1 text-xl font-bold text-slate-300'>
								{userMessage[0]}
							</div>
							<div className='text-md px-4 md:px-0'>
								{userMessage[1]}
							</div>
						</div>
					</div>

					<div className="w-full py-4 px-4  bg-slate-800 sm:rounded-lg">
						<DeckInfoPanel
							deckId={id}
							scheduler={scheduler}
							solutionToggled={solutionToggled}
							position={position}
							isLoaded={isLoaded}
						/>
					</div>
					
				</div>
			</div>
		</div>
	);
	
	
}

export default ReviewSession;