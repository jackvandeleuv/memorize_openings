// components/Piece.tsx
import React from 'react';
import Image from 'next/image';

interface PieceProps {
  piece: string,
  color: string,
}

const Piece: React.FC<PieceProps> = ({piece, color}) => {
<<<<<<< HEAD
  const imagePath = `/Chess_${piece}${color}t45.svg`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={imagePath}
          alt={`${color} ${piece}`}
          width="100"
          height="100"
          
        />
=======
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={`/Chess_${piece}${color}t45.svg`}
        alt={`${color} ${piece}`}
        width="100"
        height="100"
      />
>>>>>>> main
    </div>
  );}

export default Piece;
