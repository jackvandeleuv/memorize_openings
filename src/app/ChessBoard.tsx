'use client';

import React, { useState } from 'react';
import Cell from './Cell';
import Piece from './Piece';

interface Piece {
  piece: 'p' | 'r' | 'n' | 'b' | 'k' | 'q';
  color: 'l' | 'd'; 
}
type PiecesState = (Piece | null)[][];

const ChessBoard: React.FC = () => {
  const [pieces, setPieces] = useState<PiecesState>(() => {
    const initialPieces = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let i = 0; i < 8; i++) {
      initialPieces[6][i] = {piece: 'p', color: 'd'};
      initialPieces[1][i] = {piece: 'p', color: 'l'};
    }
    initialPieces[7][0] = {piece: 'r', color: 'd'};
    initialPieces[7][1] = {piece: 'n', color: 'd'};
    initialPieces[7][2] = {piece: 'b', color: 'd'};
    initialPieces[7][3] = {piece: 'q', color: 'd'};
    initialPieces[7][4] = {piece: 'k', color: 'd'};
    initialPieces[7][5] = {piece: 'b', color: 'd'};
    initialPieces[7][6] = {piece: 'n', color: 'd'};
    initialPieces[7][7] = {piece: 'r', color: 'd'};
    initialPieces[0][0] = {piece: 'r', color: 'l'};
    initialPieces[0][1] = {piece: 'n', color: 'l'};
    initialPieces[0][2] = {piece: 'b', color: 'l'};
    initialPieces[0][3] = {piece: 'q', color: 'l'};
    initialPieces[0][4] = {piece: 'k', color: 'l'};
    initialPieces[0][5] = {piece: 'b', color: 'l'};
    initialPieces[0][6] = {piece: 'n', color: 'l'};
    initialPieces[0][7] = {piece: 'r', color: 'l'};
  
    return initialPieces;
  });
  const [prevClickedPiece, setPrevClickedPiece] = useState('');
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);

  
  const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Validate the move and update the pieces state
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      const updatedPieces = [...pieces];
      const pieceToMove = updatedPieces[fromRow][fromCol];
      updatedPieces[fromRow][fromCol] = null;
      updatedPieces[toRow][toCol] = pieceToMove;
      setPieces(updatedPieces);
      toggleCellHighlight(`${fromRow}-${fromCol}`)
    }
  }; 

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Add your custom logic to validate the move
    // Return true if the move is valid, false otherwise
    // You can use the current state of `pieces` to determine the validity of the move
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

  // const highlightCell = (cellId: string) => {
  //   const [row, col] = cellId.split('-');
  //   const updatedCells = [...highlightedCells];
  //   updatedCell[fromRow][fromCol] = null;
  //   updatedPieces[toRow][toCol] = pieceToMove;
  //   setPieces(updatedPieces);
  // };

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
