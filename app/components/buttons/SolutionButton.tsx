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
			className={`flex flex-grow justify-center px-4 py-4 text-slate-300 font-bold rounded ${solutionToggled ? 'bg-green-600' : 'bg-slate-700'} ${solutionToggled ? 'hover:bg-green-500' : 'hover:bg-slate-600'} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
			onClick={handleClick}
		>
			<div className="text-xs sm:text-lg">
				{children}
			</div>
		</button>
	);
};

export default SolutionButton;
