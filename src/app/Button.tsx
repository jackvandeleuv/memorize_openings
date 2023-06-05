import React from 'react';

interface ButtonProps {
	children: string;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<ButtonProps> = ({ id, children, handleClick }) => {
	return (
		<div>
			<button
			id={id}
			className={`bg-zinc-400 hover:bg-zinc-300 text-white font-bold py-2 px-5 rounded-md`}
			onClick={(event) => {
				handleClick(event)
			}}
			>
			{children}
			</button>
		</div>
	);
};

export default Button;