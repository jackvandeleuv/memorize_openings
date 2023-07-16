import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const ArrowButton: React.FC<ButtonProps> = ({ id, children, handleClick }) => {
	return (
		<button
			id={id}
			className={`bg-slate-700 flex flex-grow justify-center px-4 py-4 text-slate-300 font-bold rounded hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-opacity-50`}
			onClick={handleClick}
		>
            <div className="text-xs sm:text-lg md:px-2">
			    {children}
            </div>
		</button>
	);
};

export default ArrowButton;
