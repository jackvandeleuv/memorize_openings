import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	color: string;
};

const Button: React.FC<ButtonProps> = ({ id, children, handleClick, color }) => {
	return (
		<button
			id={id}
			className={`${color} px-4 py-2 text-white font-bold rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50`}
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
