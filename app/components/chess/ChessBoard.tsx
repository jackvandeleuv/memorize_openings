'use client';

import React, { useState, useEffect } from 'react';
import Piece from './Piece';
import { Chess, Square } from 'chess.js';
import { Position } from '../../ReviewSession';
import Cell from './Cell';

export interface Piece {
	piece: 'p' | 'r' | 'n' | 'b' | 'k' | 'q' | '';
	color: 'l' | 'd' | ''; 
}

export type BoardState = (Piece)[][];

interface ChessBoardProps {
	solutionToggled: boolean;
	position: Position;
	setPosition: React.Dispatch<React.SetStateAction<Position>>;
	setUserMessage: React.Dispatch<React.SetStateAction<string[]>>;
}

let successAudio: HTMLAudioElement;
let failureAudio: HTMLAudioElement;
if (typeof window !== "undefined") {
    successAudio = new Audio('/538554__sjonas88__success_clipped.wav');
    failureAudio = new Audio('/538550__sjonas88__deep-tone_clipped.wav');
}

const ChessBoard: React.FC<ChessBoardProps> = ({ solutionToggled, position, setPosition, setUserMessage }) => {
	const [prevClickedPiece, setPrevClickedPiece] = useState('');
	const [highlightMap, setHighlightMap] = useState(new Map<string, string>());
	const [reversed, setReversed] = useState<boolean>(false);
	const [boardState, setBoardState] = useState<Piece[][]>(Array.from({ length: 8 }, () => Array(8).fill({ piece: '', color: '' })));

	useEffect(() => {
		const handleDragStart = (e: DragEvent) => {
			if (e.target && (e.target as HTMLElement).dataset.draggable === "true") {
				e.preventDefault();
			}
		};
		window.addEventListener("dragstart", handleDragStart);
		return () => {
			window.removeEventListener("dragstart", handleDragStart);
		};
	}, []);

	// When the position changes, figure out if the board should be from black's perspective
	useEffect(() => {
		if (position.line[position.move] === '8/8/8/8/8/8/8/8 w KQkq - 0 1') return;
		setReversed(new Chess(position.answer).turn() === 'b')
	}, [position]);


	// Toggle destination highlight if using arrow buttons
	useEffect(() => {
		const toggleDestinationHighlight = () => {
			const cellId = `${position.guess.row}-${position.guess.col}`

			// If we have a color to add and move is at the end of line, 
			// and show solution isn't on, add the highlight
			if (
				position.guess.color !== '' && 
				position.move >= position.line.length - 1 &&
				!solutionToggled
			) {
				setHighlightMap(prevMap => new Map(prevMap.set(cellId, position.guess.color)));
			};

			// Delete highlight if no color, not at the end of line, or no solution
			if (
				position.guess.color === '' ||
				position.move < position.line.length - 1 ||
				solutionToggled
			) 
				setHighlightMap(prevMap => {
					const newMap = new Map(prevMap);
					newMap.delete(cellId);
					return newMap;
				});
		};
		toggleDestinationHighlight();
	}, [position, solutionToggled]);


	useEffect(() => {
		setBoardState(fenToBoard(position.line[position.move]));
	  }, [position]);	  
	

	const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
		// Toggle and return if not at the end of the line, invalid move, or if showing the solution
		if (position.move < position.line.length - 1 || 
			!isValidMove(fromRow, fromCol, toRow, toCol) ||
			solutionToggled
		) {
			toggleYellowHighlight(`${fromRow}-${fromCol}`);
			toggleYellowHighlight(`${fromRow}-${fromCol}`);
			return;
		}

		// Move the piece on the user's board
		const updatedPieces: BoardState = [...boardState];
		const pieceToMove = updatedPieces[fromRow][fromCol];
		updatedPieces[fromRow][fromCol] = { piece: '', color: '' };
		updatedPieces[toRow][toCol] = pieceToMove;

		// Check if the user got the position right
		const newGameState = new Chess(position.game.fen());
		newGameState.move({
			from:indexToAlgebraic(fromCol, fromRow),
			to:indexToAlgebraic(toCol, toRow)
		})
		const isCorrect = newGameState.fen().split(' ')[0] === position.answer.split(' ')[0];

		isCorrect ? successAudio.play() : failureAudio.play();

		// Update the position
		const updatedLine = [...position.line];
		updatedLine.push(newGameState.fen());
		const updatedMove = updatedLine.length - 1;

		// Update cell highlight colors
		const destinationColor = isCorrect ? 'bg-green-400' : 'bg-rose-300';
		const successMessage = ['Correct!', 'Great job! To see the next card, rate how hard it was for you to remember that move.']
		const failureMessage = ['Incorrect!', "That wasn't the expected move. But don't worry, you'll see it again soon. Rate the difficulty to proceed."]
		setUserMessage(isCorrect ? successMessage : failureMessage);

		setPosition({
			move: updatedMove, 
			line: updatedLine, 
			answer: position.answer, 
			game: new Chess(position.game.fen()),
			name: position.name,
			eco: position.eco,
			guess: {
				row: toRow.toString(), 
				col: toCol.toString(), 
				color: destinationColor
			}
		});
		toggleYellowHighlight(`${fromRow}-${fromCol}`);
		toggleYellowHighlight(`${fromRow}-${fromCol}`);
	}; 

	
	const toggleYellowHighlight = (id: string) => {
		if (highlightMap.has(id)) {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.delete(id)
			setHighlightMap(highlightMapCopy);
		} else {
			const highlightMapCopy = new Map(highlightMap);
			highlightMapCopy.set(id, 'bg-orange-200')
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
			line: [...position.line], 
			move: position.move, 
			answer: position.answer, 
			game: gameStateCopy,
			eco: position.eco,
			name: position.name,
			guess: {
				row: position.guess.row,
				col: position.guess.col,
				color: position.guess.color
			}
		}); 

		return true;
	};


	const renderBoard = () => {
		const board = [];
		// If it's black's turn, render everything backwards
		if (!reversed) {
			for (let i = 7; i >= 0; i--) {
				for (let j = 7; j >= 0; j--) {
					const key = `${i}-${j}`;
					const piece = boardState[i][j];
					board.push(
						<Cell
							key={key}
							row={i}
							col={j}
							piece={piece.piece}
							color={piece.color}
							handleClick={handleCellClick}
							highlight={highlightMap.get(`${i}-${j}`)}
						/>
					);
				}
			}
			return board;
		};

		// If it's white's turn, render everything forwards
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const key = `${i}-${j}`;
				const piece = boardState[i][j];
				board.push(
					<Cell
						key={key}
						row={i}
						col={j}
						piece={piece.piece}
						color={piece.color}
						handleClick={handleCellClick}
						highlight={highlightMap.get(`${i}-${j}`)}
					/>
				);
			}
		}
		return board;
	};


	const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
		toggleYellowHighlight(event.currentTarget.id);
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
		console.log('calling fentoboard')
		const parts = fen.split(" ");
		const layout = parts[0];
		let rankIndex = 7;
		let fileIndex = 0;
		const newBoard = Array.from({ length: 8 }, () => Array(8).fill({ piece: '', color: '' }));

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
		<div className="prevent-select grid grid-cols-8 aspect-[1] w-full h-full p-2 sm:p-4 md:p-0 mb-2 sm:mb-0 sm:w-[60vh] sm:h-[60vh] md:w-[50vh] md:h-[50vh] lg:w-[65vh] lg:h-[65vh]">
			{renderBoard()}
		</div>
	)}

export default ChessBoard;
