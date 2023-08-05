// components/Piece.tsx

import React from 'react';
import Image from 'next/image';
import { ConnectDragPreview } from 'react-dnd';

interface PieceProps {
  piece: string,
  color: string,
  isDragging: boolean;
  preview?: ConnectDragPreview;
  isDragPreview: boolean;
}

const Piece: React.FC<PieceProps> = ({piece, color, isDragging, preview, isDragPreview}) => {
  const imagePath = `/Chess_${piece}${color}t45.svg`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Conditionally render the piece based on isDragging */}
      {(!isDragging || isDragPreview) && (
        <Image
          src={imagePath}
          alt={`${color} ${piece}`}
          width="100"
          height="100"
          
        />
      )}

      {/* The hidden drag preview element */}
      <img ref={preview} src={imagePath} alt={`${color} ${piece}`} style={{ display: 'none' }} />
    </div>
  );}

export default Piece;
