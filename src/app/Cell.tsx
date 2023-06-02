import React from 'react';

interface CellProps {
  row: number;
  col: number;
  children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ row, col, children }) => {
  const isWhite = (row + col) % 2 === 0;

  return (
    <div
      className={`w-full h-full ${isWhite ? 'bg-white' : 'bg-green-600'}`}
      style={{ position: 'relative' }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center"
        style={{ padding: '0%' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Cell;
