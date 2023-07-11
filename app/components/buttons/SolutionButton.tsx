import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	solutionToggled: boolean;
};

const SolutionButton: React.FC<ButtonProps> = ({ id, children, handleClick, solutionToggled }) => {
	return (
		<button
			id={id}
			className={`flex flex-grow justify-center px-4 py-4 text-white font-bold rounded ${solutionToggled ? 'bg-green-500' : 'bg-indigo-600'} ${solutionToggled ? 'hover:bg-green-400' : 'hover:bg-indigo-400'} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
			onClick={handleClick}
		>
			<div className="text-xs sm:text-lg">
				{children}
			</div>
		</button>
	);
};

export default SolutionButton;
