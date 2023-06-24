'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestResponse } from '@supabase/supabase-js';
import Button from './Button';
import { Card } from './Card';
import { Scheduler } from './Scheduler';
import { setgroups } from 'process';

export interface ChessMove {
	order_in_line: number;
	fen: string;
	lines_id: number;
}

export interface Position {
	move: number;
	line: string[];
}

const ReviewSession: React.FC = () => {
	const [position, setPosition] = useState<Position>({move: 0, line: []})
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

			// Remove cards with no cooresponding moves
			cards.forEach((value, key) => {
				if (!lines.has(key)) cards.delete(key);
			});
	
			// Update each card in cards with the moves from lines
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


	const renderCards = useCallback(() => {
		if (!scheduler) return;
		const nextCard = scheduler.getNextCard();
		if (!nextCard) return;
		const nextMoves = nextCard?.moves || [];
		const nextMoveFens = nextMoves.map(move => move.fen);
		console.log('renderCards is setting position to: ' )
		for (let move of nextMoveFens) console.log(move);
		// console.log('Setting current move to: ' + position.line[position.move])
		setPosition({
			line: nextMoveFens, 
			move: Math.max(nextMoveFens.length - 2, 0)
		});
	}, [scheduler]);
	  

	useEffect(() => {
		renderCards();
	}, [renderCards]);
	  

	const arrowButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(position.line, position.move)
		if (e.currentTarget.id === '>' && position.move < position.line.length - 1) {
			const newIndex = position.move + 1;
			const currentLine = [...position.line];
			setPosition({line: currentLine, move: newIndex});
		}
		if (e.currentTarget.id === '<' && position.move > 0) {
			const newIndex = position.move - 1;
			const currentLine = [...position.line];
			setPosition({line: currentLine, move: newIndex});
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
	}


	return (
		<div className="flex flex-col items-center">
			<div className="mb-4 mt-4">
				{position.line && position.line.length > 0 &&				
					<ChessBoard
					position={position}
					setPosition={setPosition}
					/>
				}
			</div>
			<div className="flex justify-center space-x-4 mb-4">
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
			<div className="flex justify-center space-x-4">
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
	)
}

export default ReviewSession;