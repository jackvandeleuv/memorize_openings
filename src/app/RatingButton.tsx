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
        className="mx-1 mb-4 md:w-24 lg:w-28 bg-indigo-400 hover:bg-indigo-300 text-white font-bold py-2 rounded-lg"
        onClick={handleClick}
    >
      <div className="text-lg">{children}</div>
      <div className="text-sm">{time}</div>
    </button>
  );
};

export default RatingButton;
