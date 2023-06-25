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
			className="px-4 py-2 text-white font-bold rounded bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
