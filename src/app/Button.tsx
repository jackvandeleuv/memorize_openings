import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<ButtonProps> = ({ id, children, handleClick }) => {
	return (
		<button
			id={id}
			className="px-4 py-2 text-white font-bold rounded bg-indigo-400 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
