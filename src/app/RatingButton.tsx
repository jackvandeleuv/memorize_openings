import React from "react";

interface RatingButtonProps {
  id: string;
  time: string;
  children: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

}

const RatingButton: React.FC<RatingButtonProps> = ({ id, time, handleClick, children }) => {
  return (
    <button 
        id={id}
        className="mx-1 sm:w-1/2 md:24 lg:w-28 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg"
        onClick={handleClick}
    >
      <div className="text-lg">{children}</div>
      <div className="text-sm">{time}</div>
    </button>
  );
};

export default RatingButton;
