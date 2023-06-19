'use client';

import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import ChessBoard from './ChessBoard';
import { PostgrestResponse } from '@supabase/supabase-js';
import Button from './Button';

interface ChessMove {
	id: number;
	order_in_line: number;
	fen: string;
	lines_id: number;
}

const ReviewSession: React.FC = () => {
	const [currentLine, setCurrentLine] = useState<string[]>([]);
	const [currentMove, setCurrentMove] = useState<number>(0);

	useEffect(() => {
		const signIn = async () => {
			const { data, error } = await supabaseClient.auth.signInWithPassword({
				email: process.env.TEST_USERNAME!,
				password: process.env.TEST_PASSWORD!,
			})

			if (error) {
				console.error('Error signing in:', error.message)
			}
		}

		signIn();
	}, []);
	
	useEffect(() => {
			const fetchData = async () => {
				const { data, error } = await supabaseClient
					.from('moves')
					.select('*')
					.or('lines_id.eq.407,lines_id.eq.515')

				if (error) console.error('error', error)
				else if (data) unpackMoves(data)
			}
			
			fetchData()
	}, [])

	
	function unpackMoves(moves: { [x: string]: any; }[]) {
		const chessMoves: ChessMove[] = moves.map(move => ({
		  id: move.id,
		  order_in_line: move.order_in_line,
		  fen: move.fen,
		  lines_id: move.lines_id,
		}));

		const updatedLines: ChessMove[][] = []
		let line: ChessMove[] = []
		let currentLinesId: number = chessMoves[0]['lines_id']
		for (let move of chessMoves) {
			if (currentLinesId === move.lines_id) line.push(move);
			else {
				currentLinesId = move.lines_id;
				updatedLines.push(line);
				line = [move];
			}
		}

		// Temperarily set current line to the first set of moves
		const currentLine: string[] = []
		for (let move of updatedLines[0]) {
			currentLine.push(move.fen);
		}
		console.log(currentLine)
		setCurrentLine(currentLine);
		setCurrentMove(currentLine.length - 2);
	}

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