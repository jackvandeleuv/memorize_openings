import React, { useState } from 'react';

interface CellProps {
  row: number;
  col: number;
  children?: React.ReactNode;
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Cell: React.FC<CellProps> = ({ row, col, handleClick, children }) => {
  const isWhite = (row + col) % 2 === 0;
  const [toggled, toggle] = useState(false);

  const cellStyle = `w-full h-full ${toggled ? 'bg-red-400' : (isWhite ? 'bg-white' : 'bg-green-600')}`;

  return (
    <div
      draggable="true"
      className={cellStyle}
      style={{ position: 'relative' }}
      onClick={(event) => {
        handleClick(event); 
        toggle(!toggled);
      }}
      id={`${row}-${col}`}
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
