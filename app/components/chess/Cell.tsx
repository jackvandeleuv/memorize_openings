import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Piece from './Piece';
import { ClickLoc } from './ChessBoard';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface CellProps {
	row: number;
	col: number;
	piece: string;
	color: string;
	setClickLoc: React.Dispatch<React.SetStateAction<ClickLoc>>;
	// handleClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	handlePieceDrop: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
	highlight: string | undefined;
}

interface DraggablePiece {
	row: number;
	col: number;
	piece: string;
	color: string;
}

const Cell: React.FC<CellProps> = ({ row, col, piece, color, handlePieceDrop, setClickLoc, highlight }) => {
	const isWhite = (row + col) % 2 === 0;

	const [{ canDrop, isOver }, drop] = useDrop({
		accept: 'PIECE',
		drop: (item: DraggablePiece) => handlePieceDrop(item.row, item.col, row, col),
		collect: (monitor) => ({
		  isOver: !!monitor.isOver(),
		  canDrop: !!monitor.canDrop(),
		}),
	});

	const [{ isDragging }, drag, preview] = useDrag({
		type: 'PIECE',
		item: { row, col, piece, color },
		collect: (monitor) => ({
		  isDragging: !!monitor.isDragging(),
		}),
		end: (item, monitor) => {
			// This function runs when the drag operation ends
			if (!monitor.didDrop()) {
			  console.log('thing did not drop')
			}
		  },
	});

	preview(getEmptyImage());

	const cellStyle = `draggable w-full h-full ${highlight !== undefined ? highlight : (isWhite ? 'bg-slate-200' : 'bg-slate-400')}`;

	const ref = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		const rect = ref.current!.getBoundingClientRect();
		setClickLoc({x: e.clientX - rect.left, y: e.clientY - rect.top});
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		const rect = ref.current!.getBoundingClientRect();
		setClickLoc({
		  x: e.touches[0].clientX - rect.left, 
		  y: e.touches[0].clientY - rect.top
		});
	  };
	  

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
	  
	  const combinedRef = useCombinedRefs(ref, drag, drop);	

	return (
		<div
			data-draggable="true"
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart} 
			ref={combinedRef}
			className={cellStyle}
			style={{ position: 'relative' }}
			id={`${row}-${col}`}
		>
			<div
				className="absolute top-0 left-0 w-full h-full flex justify-center"
				style={{ padding: '0%' }}
			>
				{piece && 
					<Piece
						piece={piece}
						color={color}
						isDragging={isDragging}
						preview={preview}
						isDragPreview={false}
					/>
				}
			</div>
		</div>
	);
};

export default Cell;
