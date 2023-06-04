import React, { useState } from 'react';

interface CellProps {
	row: number;
	col: number;
	children?: React.ReactNode;
	handleClick: (event: React.MouseEvent<HTMLDivElement>, isHighlighted: boolean) => void;
	isHighlighted: boolean
}

const Cell: React.FC<CellProps> = ({ row, col, handleClick, children, isHighlighted }) => {
	const isWhite = (row + col) % 2 === 0;
	const cellStyle = `w-full h-full ${isHighlighted ? 'bg-red-400' : (isWhite ? 'bg-white' : 'bg-green-600')}`;

	return (
		<div
			className={cellStyle}
			style={{ position: 'relative' }}
			onClick={(event) => {
				handleClick(event, isHighlighted); 
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
