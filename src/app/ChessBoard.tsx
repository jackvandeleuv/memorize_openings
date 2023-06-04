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
  currentLine: BoardState[];
  currentMove: number;
  setCurrentMove: React.Dispatch<React.SetStateAction<number>>;
  setCurrentLine: React.Dispatch<React.SetStateAction<BoardState[]>>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ currentLine, currentMove, setCurrentMove, setCurrentLine }) => {
  const [prevClickedPiece, setPrevClickedPiece] = useState('');
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);

  const [gameState, setGameState] = useState<Chess>(new Chess());
  const gameRef = useRef(gameState);
  useEffect(() => { gameRef.current = gameState }, [gameState]);
  
  const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Validate the move and update the pieces state
    if (currentMove === currentLine.length - 1 && isValidMove(fromRow, fromCol, toRow, toCol)) {
      const updatedPieces: BoardState = [...currentLine[currentMove]];
      const pieceToMove = updatedPieces[fromRow][fromCol];
      updatedPieces[fromRow][fromCol] = null;
      updatedPieces[toRow][toCol] = pieceToMove;

      // 
      //
      // Two state updates in might lead to async errors?
      //
      //
      setCurrentLine(prevLines => [...prevLines, updatedPieces]);
      setCurrentMove(prevMove => prevMove + 1);
    } 
    toggleCellHighlight(`${fromRow}-${fromCol}`)
  }; 

  useEffect(() => {console.log(currentMove); console.log(currentLine.length - 1)}, [currentMove, currentLine]);

  const validateSquare = (square: string): square is Square => {
    const validSquares = Array.from({length: 8}, (_, i) => i + 1).flatMap(i =>
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => `${letter}${i}` as Square)
    );
    return validSquares.includes(square as Square);
    }

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const gameStateCopy = new Chess(gameRef.current.fen());

    // In algebraic notation
    const fromString = `${String.fromCodePoint(fromCol + 97)}${(Math.abs(fromRow - 8))}`;
    const toString = `${String.fromCodePoint(toCol + 97)}${(Math.abs(toRow - 8))}`

    let isValid = false;
    if (validateSquare(fromString) && validateSquare(toString)) {
      const fromSquare: Square = fromString;
      const validMoves = gameStateCopy.moves({square: fromSquare, verbose: true});
      for (let move of validMoves) {
        console.log(move);
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
        const piece = currentLine[currentMove][i][j];
        board.push(
          <Cell
            key={key}
            row={i}
            col={j}
            handleClick={handleCellClick}
            isHighlighted={highlightedCells.includes(`${i}-${j}`)}
            >
            {piece && (
              <Piece
                piece={piece.piece}
                color={piece.color}
              />
            )}
          </Cell>
        );
      }
    }

    return board;
  };


  const toggleCellHighlight = (id: string) => {
    if (!highlightedCells.includes(id)) {
      const updatedCells = [...highlightedCells]
      updatedCells.push(id);
      setHighlightedCells(updatedCells);
    } else {
      const updatedCells = [...highlightedCells].filter(item => item !== id);
      setHighlightedCells(updatedCells);
    }
  }

  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    toggleCellHighlight(event.currentTarget.id);
    if (prevClickedPiece == '') { 
      setPrevClickedPiece(event.currentTarget.id); 
    } else {
      const [newRow, newCol] = event.currentTarget.id.split("-");
      const [oldRow, oldCol] = prevClickedPiece.split("-");
      handlePieceMove(parseInt(oldRow), parseInt(oldCol), parseInt(newRow), parseInt(newCol));
      setPrevClickedPiece('');
    }
  };

  return (
    <div className="grid grid-cols-8 w-[50vh] h-[50vh] aspect-[1]">
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;
