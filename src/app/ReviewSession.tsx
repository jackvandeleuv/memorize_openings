'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestResponse } from '@supabase/supabase-js';
import Button from './Button';
import { Card } from './Card';
import { Scheduler } from './Scheduler';

export interface ChessMove {
	order_in_line: number;
	fen: string;
	lines_id: number;
}

const ReviewSession: React.FC = () => {
	const [currentLine, setCurrentLine] = useState<string[]>([]);
	const [currentMove, setCurrentMove] = useState<number>(0);
	const [scheduler, setScheduler] = useState<Scheduler>();


	// useEffect(() => {
	// 	const signIn = async () => {
	// 		const { data, error } = await supabaseClient.auth.signInWithPassword({
	// 			email: process.env.TEST_USERNAME!,
	// 			password: process.env.TEST_PASSWORD!,
	// 		})
	
	// 		if (error) {
	// 			console.error('Error signing in:', error.message)
	// 		}
	// 	}

	// 	signIn();
	// }, [])
	
	useEffect(() => {
		const fetchCards = async () => {
			const { data: cardsData, error: cardsError } = await supabaseClient
				.from('cards')
				.select(`ease, interval, is_new, step, review_at, id`)
			if (cardsError) console.error('error', cardsData)

			const cards = new Map<number, Card>();
			for (let row of cardsData!) {
				const card = new Card(row.ease, row.interval, row.is_new, row.step, row.review_at);
				cards.set(row.id, card);
			}

			const { data: movesData, error: movesError } = await supabaseClient
			.from('cards_to_moves')
			.select(`
				cards_id,
				moves (
					order_in_line,
					fen,
					lines_id
				)
			`)
			.in('cards_id', Array.from(cards!.keys()))

			if (movesError) console.error('error', movesError);
		
			const lines = new Map<number, ChessMove[]>();
			for (let row of movesData!) {
				let mappedMoves: ChessMove[] | undefined = lines.get(row.cards_id);
				if (mappedMoves === undefined) mappedMoves = [];
	
				const rowData = row.moves!;

				if (Array.isArray(rowData)) throw new Error ('Did not expect array!');
				
				mappedMoves.push({
					fen: rowData.fen, 
					order_in_line: rowData.order_in_line, 
					lines_id: rowData.lines_id
				})
				lines.set(row.cards_id, mappedMoves)
			}
	
			for (let key of Array.from(lines.keys())) {
				const card = cards.get(key);
				let moves = lines.get(key);
				moves = moves?.sort((a, b) => a.order_in_line - b.order_in_line)
				card?.setMoves(moves!);
			}
			
			if (cards == null) throw new Error('Cards should not be null!');
			const scheduler = new Scheduler();
			for (let key of Array.from(cards.keys())) {
				scheduler.addCard(cards.get(key)!)
			}
			scheduler.updateQueue();
			setScheduler(scheduler);
		}
		
		fetchCards();
	}, [])


	const renderBoard = useCallback(() => {
		if (!scheduler) return;
		const nextCard = scheduler.getNextCard();
		if (!nextCard) return;
		const nextMoves = nextCard?.moves || [];
		const nextMoveFens = nextMoves.map(move => move.fen);
		setCurrentLine(nextMoveFens);
		setCurrentMove(Math.max(nextMoveFens.length - 2, 0));
	  }, [scheduler]);
	  

	  useEffect(() => {
		renderBoard();
	  }, [renderBoard]);
	  
	
	// function unpackMoves(moves: { [x: string]: any; }[]) {
	// 	const chessMoves: ChessMove[] = moves.map(move => ({
	// 	  id: move.id,
	// 	  order_in_line: move.order_in_line,
	// 	  fen: move.fen,
	// 	  lines_id: move.lines_id,
	// 	}));

	// 	const updatedLines: ChessMove[][] = []
	// 	let line: ChessMove[] = []
	// 	let currentLinesId: number = chessMoves[0]['lines_id']
	// 	for (let move of chessMoves) {
	// 		if (currentLinesId === move.lines_id) line.push(move);
	// 		else {
	// 			currentLinesId = move.lines_id;
	// 			updatedLines.push(line);
	// 			line = [move];
	// 		}
	// 	}

	// 	// Temperarily set current line to the first set of moves
	// 	const currentLine: string[] = []
	// 	for (let move of updatedLines[0]) {
	// 		currentLine.push(move.fen);
	// 	}
	// 	console.log(currentLine)
	// 	setCurrentLine(currentLine);
	// 	setCurrentMove(currentLine.length - 2);
	// }

	const buttonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e.currentTarget.id === '>' && currentMove < currentLine.length - 2) {
			const newIndex = currentMove + 1;
			setCurrentMove(newIndex);
		}

		if (e.currentTarget.id === '<' && currentMove > 0) {
			const newIndex = currentMove - 1;
			setCurrentMove(newIndex);
		}
	}


	return (
		<div className="flex flex-col items-center">
			<div className="mb-4 mt-4">
				{currentLine && currentLine.length > 0 &&				
					<ChessBoard
					currentLine={currentLine}
					setCurrentLine={setCurrentLine}
					currentMove={currentMove}
					setCurrentMove={setCurrentMove}
					/>
				}
			</div>
			<div className="flex justify-center space-x-4 mb-4">
				<Button
				id='<'
				handleClick={buttonClick}
				>
					{'<'}
				</Button>
				<Button
				id='>'
				handleClick={buttonClick}
				>
					{'>'}
				</Button>
			</div>
			<div className="flex justify-center space-x-4">
				<Button
				id='??'
				handleClick={buttonClick}
				>
					{'??'}
				</Button>
				<Button
				id='?!'
				handleClick={buttonClick}
				>
					{'?!'}
				</Button>
				<Button
				id='!?'
				handleClick={buttonClick}
				>
					{'!?'}
				</Button>
				<Button
				id='!!'
				handleClick={buttonClick}
				>
					{'!!'}
				</Button>
			</div>
		</div>
	)
}

export default ReviewSession;