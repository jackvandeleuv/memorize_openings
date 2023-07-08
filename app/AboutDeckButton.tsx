import React, { ReactNode, ReactSVG } from 'react';
import Image from 'next/image';

interface AboutDeckButtonProps {
	children: ReactNode;
	id: string;
	handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AboutDeckButton: React.FC<AboutDeckButtonProps> = ({ id, children, handleClick }) => {
	return (
		<button
			id={id}
			className={`p-2 text-white font-bold rounded hover:bg-indigo-500`}
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default AboutDeckButton;
