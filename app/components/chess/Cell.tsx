<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
import Piece from './Piece';
=======
import React from 'react';
>>>>>>> main

interface CellProps {
	row: number;
	col: number;
<<<<<<< HEAD
	piece: string;
	color: string;
=======
	children?: React.ReactNode;
>>>>>>> main
	handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	highlight: string | undefined;
}

<<<<<<< HEAD

const Cell: React.FC<CellProps> = ({ row, col, piece, color, handleClick, highlight }) => {
	const isWhite = (row + col) % 2 === 0;
	const cellStyle = `w-full h-full ${highlight !== undefined ? highlight : (isWhite ? 'bg-slate-200' : 'bg-slate-400')}`;

	const ref = useRef<HTMLDivElement>(null);
	  
	function useCombinedRefs(...refs: React.Ref<HTMLDivElement>[]) {
		const targetRef = useRef<HTMLDivElement | null>(null);
	  
		useEffect(() => {
		  refs.forEach(ref => {
			if (typeof ref === 'function') {
			  ref(targetRef.current);
			} else if (ref && 'current' in ref) {
			  (ref as React.MutableRefObject<HTMLDivElement | null>).current = targetRef.current;
			}
		  });
		}, [refs]);
	  
		return targetRef;
	  };
	  

	return (
		<div
			onClick={handleClick}
=======
const Cell: React.FC<CellProps> = ({ row, col, handleClick, children, highlight }) => {
	const isWhite = (row + col) % 2 === 0;
	const cellStyle = `w-full h-full ${highlight !== undefined ? highlight : (isWhite ? 'bg-slate-200' : 'bg-slate-400')}`;

	return (
		<div
>>>>>>> main
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
<<<<<<< HEAD
				{piece && 
					<Piece
						piece={piece}
						color={color}
					/>
				}
=======
				{children}
>>>>>>> main
			</div>
		</div>
	);
};

export default Cell;
