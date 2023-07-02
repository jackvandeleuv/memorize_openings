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
        className="mx-1 my-4 md:my-0 md:mb-4 md:w-24 lg:w-28 py-2 px-2 bg-indigo-400 hover:bg-indigo-300 text-white font-bold rounded-lg"
        onClick={handleClick}
    >
      <div className="text-md sm:text-lg">{children}</div>
      <div className="text-xs sm:text-sm">{time}</div>
    </button>
  );
};

export default RatingButton;
