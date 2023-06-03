'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cell from './Cell';
import Piece from './Piece';
import { Chess, Square, Move } from 'chess.js';

interface Piece {
  piece: 'p' | 'r' | 'n' | 'b' | 'k' | 'q';
  color: 'l' | 'd'; 
}
type PiecesState = (Piece | null)[][];

const ChessBoard: React.FC = () => {
  const [pieces, setPieces] = useState<PiecesState>(() => {
    const initialPieces = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let i = 0; i < 8; i++) {
      initialPieces[6][i] = {piece: 'p', color: 'l'};
      initialPieces[1][i] = {piece: 'p', color: 'd'};
    }
    initialPieces[7][0] = {piece: 'r', color: 'l'};
    initialPieces[7][1] = {piece: 'n', color: 'l'};
    initialPieces[7][2] = {piece: 'b', color: 'l'};
    initialPieces[7][3] = {piece: 'q', color: 'l'};
    initialPieces[7][4] = {piece: 'k', color: 'l'};
    initialPieces[7][5] = {piece: 'b', color: 'l'};
    initialPieces[7][6] = {piece: 'n', color: 'l'};
    initialPieces[7][7] = {piece: 'r', color: 'l'};
    initialPieces[0][0] = {piece: 'r', color: 'd'};
    initialPieces[0][1] = {piece: 'n', color: 'd'};
    initialPieces[0][2] = {piece: 'b', color: 'd'};
    initialPieces[0][3] = {piece: 'q', color: 'd'};
    initialPieces[0][4] = {piece: 'k', color: 'd'};
    initialPieces[0][5] = {piece: 'b', color: 'd'};
    initialPieces[0][6] = {piece: 'n', color: 'd'};
    initialPieces[0][7] = {piece: 'r', color: 'd'};
  
    return initialPieces;
  });
  const [prevClickedPiece, setPrevClickedPiece] = useState('');
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);

  const [gameState, setGameState] = useState<Chess>(new Chess());
  const gameRef = useRef(gameState);
  useEffect(() => { gameRef.current = gameState }, [gameState])
  
  const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Validate the move and update the pieces state
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      const updatedPieces = [...pieces];
      const pieceToMove = updatedPieces[fromRow][fromCol];
      updatedPieces[fromRow][fromCol] = null;
      updatedPieces[toRow][toCol] = pieceToMove;
      setPieces(updatedPieces);
    } 
    toggleCellHighlight(`${fromRow}-${fromCol}`)
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
        const piece = pieces[i][j];
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
