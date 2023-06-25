'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cell from './Cell';
import Piece from './Piece';
import { Chess, Square } from 'chess.js';
import { Position, AnswerToggle } from './ReviewSession';

export interface Piece {
	piece: 'p' | 'r' | 'n' | 'b' | 'k' | 'q';
	color: 'l' | 'd'; 
}

export type BoardState = (Piece | null)[][];

interface ChessBoardProps {
	position: Position;
	setPosition: React.Dispatch<React.SetStateAction<Position>>;
	answerToggle: AnswerToggle;
	setAnswerToggle: React.Dispatch<React.SetStateAction<AnswerToggle>>;
}


const ChessBoard: React.FC<ChessBoardProps> = ({ position, setPosition, answerToggle, setAnswerToggle }) => {
	const [prevClickedPiece, setPrevClickedPiece] = useState('');
	const [highlightMap, setHighlightMap] = useState(new Map<string, string>());


	// Toggle destination highlight if using arrow buttons
	useEffect(() => {
		// If we have an empty toggler, return
		if (answerToggle.color === '' && answerToggle.row === '' && answerToggle.col === '') return;

		// Otherwise, prepare highlight map for updating
		const updatedMap = new Map<string, string>(highlightMap);
		const cellId = `${answerToggle.row}-${answerToggle.col}`;

		if (answerToggle.color === '' && answerToggle.row !== '' && answerToggle.col !== '') updatedMap.delete(cellId);
		if (answerToggle.color !== '' && position.move < position.line.length - 1) updatedMap.delete(cellId);
		if (answerToggle.color !== '' && position.move >= position.line.length - 1) updatedMap.set(cellId, answerToggle.color);

		setHighlightMap(updatedMap);

	}, [answerToggle, position]);
	

	const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
		// Toggle and return if we're earlier in the line or move is invalid
		if (position.move < position.line.length - 1 || !isValidMove(fromRow, fromCol, toRow, toCol)) {
			toggleYellowHighlight(`${fromRow}-${fromCol}`);
			return;
		}

		// Move the piece on the user's board
		const updatedPieces: BoardState = [...fenToBoard(position.line[position.move])];
		const pieceToMove = updatedPieces[fromRow][fromCol];
		updatedPieces[fromRow][fromCol] = null;
		updatedPieces[toRow][toCol] = pieceToMove;

		// Check if the user got the position right
		const newGameState = new Chess(position.game.fen());
		newGameState.move({
			from:indexToAlgebraic(fromCol, fromRow),
			to:indexToAlgebraic(toCol, toRow)
		})
		const isCorrect = newGameState.fen() === position.answer;

		// Update the position
		const updatedLine = [...position.line];
		updatedLine.push(newGameState.fen());
		const updatedMove = updatedLine.length - 1;

		setPosition({
			move: updatedMove, 
			line: updatedLine, 
			answer: position.answer, 
			game: new Chess(position.game.fen()),
			name: position.name,
			eco: position.eco
		});

		// Update cell highlight colors
		const destinationColor = isCorrect ? 'bg-green-600' : 'bg-red-600';
		const updatedMap = new Map(highlightMap);
		updatedMap.delete(`${fromRow}-${fromCol}`)
		updatedMap.set(`${toRow}-${toCol}`, destinationColor);
		setHighlightMap(updatedMap);

		// Update the answer color toggle
		setAnswerToggle({row: toRow.toString(), col: toCol.toString(), color: destinationColor})
	}; 

	
	const toggleYellowHighlight = (id: string) => {
		if (highlightMap.has(id)) {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.delete(id)
			setHighlightMap(highlightMapCopy);
		} else {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.set(id, 'bg-zinc-300')
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
		const gameStateCopy = new Chess(position.game.fen());

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
		setPosition({
			line: position.line, 
			move: position.move, 
			answer: position.answer, 
			game: gameStateCopy,
			eco: position.eco,
			name: position.name
		}); 

		return true;
	};


	const renderBoard = () => {
		const board = [];

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const key = `${i}-${j}`;
				const piece = fenToBoard(position.line[position.move])[i][j];
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
