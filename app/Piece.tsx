// components/Piece.tsx
import React from 'react';

interface PieceProps {
  piece: string,
  color: string,
}

const Piece: React.FC<PieceProps> = ({piece, color}) => {
  return <img src={`/Chess_${piece}${color}t45.svg`} alt={`${color} ${piece}`}/>
}

export default Piece;
