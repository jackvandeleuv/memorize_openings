import React, { useEffect, useState } from "react";
import { Position } from "./ReviewSession";

interface RatingButtonProps {
  id: string;
  time: string;
  children: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  position: Position;
  solutionToggled: boolean;
}

const RatingButton: React.FC<RatingButtonProps> = ({ id, time, handleClick, children, position, solutionToggled }) => {
  const [canRate, setCanRate] = useState<boolean>(false);

  useEffect(() => {
    const updatedCanRate = position.guess.color === '' && !solutionToggled;
    setCanRate(updatedCanRate);
  }, [position, solutionToggled]);

  return (
    <button 
        id={id}
        className={`flex flex-col flex-grow justify-center items-center px-2 py-3 md:my-0 md:mb-4 ${canRate ? 'bg-indigo-300 text-indigo-200': 'bg-indigo-600 hover:bg-indigo-400 text-white'} font-bold rounded-md`}
        onClick={handleClick}
    >
      <div className="text-sm sm:text-lg">{children}</div>
      <div className="text-xs sm:text-sm">{time}</div>
    </button>
  );
};

export default RatingButton;
