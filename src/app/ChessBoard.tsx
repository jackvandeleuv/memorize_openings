'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cell from './Cell';
import Piece from './Piece';
import { Chess, Square } from 'chess.js';

export interface Piece {
	piece: 'p' | 'r' | 'n' | 'b' | 'k' | 'q';
	color: 'l' | 'd'; 
}

export type BoardState = (Piece | null)[][];

interface ChessBoardProps {
	currentLine: string[];
	setCurrentLine: React.Dispatch<React.SetStateAction<string[]>>;
	currentMove: number;
	setCurrentMove: React.Dispatch<React.SetStateAction<number>>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ currentLine, currentMove, setCurrentMove, setCurrentLine }) => {
	const [prevClickedPiece, setPrevClickedPiece] = useState('');
	const [highlightMap, setHighlightMap] = useState(new Map<string, string>());

	const [gameState, setGameState] = useState<Chess>(() => {
		const game: Chess = new Chess();
		game.load(currentLine[currentLine.length - 2])
		return game;
	});
	const gameRef = useRef(gameState);
	useEffect(() => { gameRef.current = gameState }, [gameState]);
	

	const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
		console.log(highlightMap);
		// Toggle and return if we're earlier in the line or move is invalid
		if (currentMove >= currentLine.length - 1 || !isValidMove(fromRow, fromCol, toRow, toCol)) {
			toggleYellowHighlight(`${fromRow}-${fromCol}`);
			return;
		}

		// Move the piece on the user's board
		const updatedPieces: BoardState = [...fenToBoard(currentLine[currentMove])];
		const pieceToMove = updatedPieces[fromRow][fromCol];
		updatedPieces[fromRow][fromCol] = null;
		updatedPieces[toRow][toCol] = pieceToMove;

		// Check if the user got the position right
		const newGameState = new Chess(gameRef.current.fen());
		newGameState.move({
			from:indexToAlgebraic(fromCol, fromRow),
			to:indexToAlgebraic(toCol, toRow)
		})
		const isCorrect = newGameState.fen() === currentLine[currentLine.length - 1];

		// Update the React state
		const newFen = isCorrect ? currentLine[currentLine.length - 1] : newGameState.fen();
		setCurrentLine(prevLines => [...prevLines.slice(0, currentLine.length - 1), newFen]);
		setCurrentMove(prevMove => prevMove + 1);

		// Update cell highlight colors
		toggleYellowHighlight(`${fromRow}-${fromCol}`);
		const destinationColor = isCorrect ? 'bg-green-400' : 'bg-red-400';
		const updatedMap = new Map(highlightMap);
		console.log('Before updating map: ' + updatedMap.size);
		updatedMap.set(`${toRow}-${toCol}`, destinationColor);
		setHighlightMap(updatedMap);
		console.log('After updating map: ' + updatedMap.size);
	}; 

	
	const toggleYellowHighlight = (id: string) => {
		if (highlightMap.has(id)) {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.delete(id)
			setHighlightMap(highlightMapCopy);
		} else {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.set(id, 'bg-amber-500')
			setHighlightMap(highlightMapCopy);
		}
	};


	const indexToAlgebraic = (col: number, row: number) => {
		return `${String.fromCodePoint(col + 97)}${(Math.abs(row - 8))}`;
	};


	const validateSquare = (square: string): square is Square => {
		const validSquares = Array.from({length: 8}, (_, i) => i + 1).flatMap(i =>
			['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => `${letter}${i}` as Square)
		);
		return validSquares.includes(square as Square);
	}


	const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
		const gameStateCopy = new Chess(gameRef.current.fen());

		// In algebraic notation
		const fromString = indexToAlgebraic(fromCol, fromRow);
		const toString = indexToAlgebraic(toCol, toRow);

		let isValid = false;
		if (validateSquare(fromString) && validateSquare(toString)) {
			const fromSquare: Square = fromString;
			const validMoves = gameStateCopy.moves({square: fromSquare, verbose: true});
			for (let move of validMoves) {
				if (toString === move.to) isValid = true;
			}
		} else {
			return false;
		}

		if (!isValid) return false;

		gameStateCopy.move({from:fromString, to:toString})
		setGameState(gameStateCopy); 

		return true;
	};


	const renderBoard = () => {
		const board = [];

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const key = `${i}-${j}`;
				const piece = fenToBoard(currentLine[currentMove])[i][j];
				board.push(
					<Cell
					key={key}
					row={i}
					col={j}
					handleClick={handleCellClick}
					highlight={highlightMap.get(`${i}-${j}`)}
					>
						{piece && (
							<Piece
							piece={piece.piece}
							color={piece.color}
						/>)}
					</Cell>
				);
			}
		}
		return board;
	};


	const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
		toggleYellowHighlight(event.currentTarget.id);
		if (prevClickedPiece == '') { 
			setPrevClickedPiece(event.currentTarget.id); 
		} else {
			const [newRow, newCol] = event.currentTarget.id.split("-");
			const [oldRow, oldCol] = prevClickedPiece.split("-");
			handlePieceMove(parseInt(oldRow), parseInt(oldCol), parseInt(newRow), parseInt(newCol));
			setPrevClickedPiece('');
		}
	};


	const fenToBoard = (fen: string): Piece[][] => {
		const parts = fen.split(" ");
		const layout = parts[0];
		let rankIndex = 7;
		let fileIndex = 0;
		const newBoard = Array.from({ length: 8 }, () => Array(8).fill(null));

		for (const char of layout) {
			if (char === "/") {
				rankIndex--;
				fileIndex = 0;
				continue;
			}

			if (isNaN(Number(char))) {
				const piece = char.toLowerCase();
				const color = char === char.toLowerCase() ? 'd' : 'l';
				newBoard[7 - rankIndex][fileIndex] = { piece:piece, color:color };
				fileIndex++;
			} else {
				fileIndex += Number(char);
			}
		}
		return newBoard;
	}


	return (
		<div className="grid grid-cols-8 w-[50vh] h-[50vh] aspect-[1]">
			{renderBoard()}
		</div>
	)}

export default ChessBoard;
