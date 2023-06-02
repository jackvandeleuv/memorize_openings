'use client';

import React, { useState } from 'react';
import Cell from './Cell';
import Piece from './Piece';

const ChessBoard: React.FC = () => {
  const [pieces, setPieces] = useState(() =>
    Array.from({ length: 8 }, () => Array(8).fill(null))
  );
  const [prevClickedPiece, setPrevClickedPiece] = useState('');
      
  pieces[6][0] = {piece: 'p', color: 'd'};
  pieces[6][1] = {piece: 'p', color: 'd'};
  pieces[6][2] = {piece: 'p', color: 'd'};
  pieces[6][3] = {piece: 'p', color: 'd'};
  pieces[6][4] = {piece: 'p', color: 'd'};
  pieces[6][5] = {piece: 'p', color: 'd'};
  pieces[6][6] = {piece: 'p', color: 'd'};
  pieces[6][7] = {piece: 'p', color: 'd'};
  pieces[1][0] = {piece: 'p', color: 'l'};
  pieces[1][1] = {piece: 'p', color: 'l'};
  pieces[1][2] = {piece: 'p', color: 'l'};
  pieces[1][3] = {piece: 'p', color: 'l'};
  pieces[1][4] = {piece: 'p', color: 'l'};
  pieces[1][5] = {piece: 'p', color: 'l'};
  pieces[1][6] = {piece: 'p', color: 'l'};
  pieces[1][7] = {piece: 'p', color: 'l'};
  pieces[7][0] = {piece: 'r', color: 'd'};
  pieces[7][1] = {piece: 'n', color: 'd'};
  pieces[7][2] = {piece: 'b', color: 'd'};
  pieces[7][3] = {piece: 'k', color: 'd'};
  pieces[7][4] = {piece: 'q', color: 'd'};
  pieces[7][5] = {piece: 'b', color: 'd'};
  pieces[7][6] = {piece: 'n', color: 'd'};
  pieces[7][7] = {piece: 'r', color: 'd'};
  pieces[0][0] = {piece: 'r', color: 'l'};
  pieces[0][1] = {piece: 'n', color: 'l'};
  pieces[0][2] = {piece: 'b', color: 'l'};
  pieces[0][3] = {piece: 'q', color: 'l'};
  pieces[0][4] = {piece: 'k', color: 'l'};
  pieces[0][5] = {piece: 'b', color: 'l'};
  pieces[0][6] = {piece: 'n', color: 'l'};
  pieces[0][7] = {piece: 'r', color: 'l'};

  const handlePieceMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Validate the move and update the pieces state
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      const updatedPieces = [...pieces];
      const pieceToMove = updatedPieces[fromRow][fromCol];
      updatedPieces[fromRow][fromCol] = null;
      updatedPieces[toRow][toCol] = pieceToMove;

      setPieces(updatedPieces);
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

  const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Handle the cell click event
    // You can implement your own logic to determine the piece to move and the target cell
    // Call handlePieceMove with the appropriate parameters to update the pieces state
    if (prevClickedPiece == '') setPrevClickedPiece(event.currentTarget.id);
    if (prevClickedPiece != '') {
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
