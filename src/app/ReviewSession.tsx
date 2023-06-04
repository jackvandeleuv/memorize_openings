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
				const response: PostgrestResponse<ChessMove> = await supabaseClient
					.from('moves')
					.select('fen')
		
				if (response.error) console.error('error', response.error)
				else if (response.data) unpackMoves(response.data)
			}
			
			fetchData()
	}, [])

	
	const unpackMoves = (moves: ChessMove[]) => {
			const updatedLine = []
			for (let move of moves) {
					updatedLine.push(move.fen);
			}
			setCurrentLine(updatedLine);
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
			<div className="mb-4">
				{currentLine && currentLine.length > 0 &&				
					<ChessBoard
					currentLine={currentLine}
					setCurrentLine={setCurrentLine}
					currentMove={currentMove}
					setCurrentMove={setCurrentMove}
					/>
				}
			</div>
			<div className="flex justify-center space-x-4">
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
		</div>
	)
}

export default ReviewSession;