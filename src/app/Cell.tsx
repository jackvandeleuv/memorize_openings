import React, { useState } from 'react';

interface CellProps {
	row: number;
	col: number;
	children?: React.ReactNode;
	handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	highlight: string | undefined;
}

const Cell: React.FC<CellProps> = ({ row, col, handleClick, children, highlight }) => {
	const isWhite = (row + col) % 2 === 0;
	const cellStyle = `w-full h-full ${highlight !== undefined ? highlight : (isWhite ? 'bg-white' : 'bg-blue-300')}`;

	return (
		<div
			className={cellStyle}
			style={{ position: 'relative' }}
			onClick={(event) => {
				handleClick(event); 
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
