import React from 'react';

interface ButtonProps {
    children: string;
    // onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
    return (
        <div>
            <button
            className={`bg-green-400 hover:bg-green-800 text-white font-bold py-2 px-5 rounded-md`}
            >
            {children}
            </button>
        </div>
    );
}

export default Button;