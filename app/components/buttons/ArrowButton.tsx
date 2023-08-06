import Position from '../../ReviewSession';
import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	solutionToggled: boolean;
	lineLength: number;
	movePosition: number;
	isLeft: boolean;
};

const ArrowButton: React.FC<ButtonProps> = ({ id, children, handleClick, solutionToggled, lineLength, movePosition, isLeft }) => {
	const isDisabled = () => {
		if (isLeft && movePosition > 0 && !solutionToggled) return false;
		if (!isLeft && movePosition < lineLength - 1 && !solutionToggled) return false;
		return true;
	};
	
	return (
		<button
			id={id}
			className={`${isDisabled() ? 'opacity-25' : 'hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-opacity-50'} bg-slate-700 flex flex-grow justify-center px-4 py-4 text-slate-300 font-bold rounded `}
			onClick={handleClick}
		>
            <div className="text-xs sm:text-lg md:px-2">
			    {children}
            </div>
		</button>
	);
};

export default ArrowButton;
