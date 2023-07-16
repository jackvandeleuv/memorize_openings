import React, { useEffect, useState } from "react";
import { Position } from "../../ReviewSession";

interface RatingButtonProps {
  id: string;
  time: string;
  children: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  position: Position;
  solutionToggled: boolean;
  sidePadding: string;
}

const RatingButton: React.FC<RatingButtonProps> = ({ id, time, handleClick, children, position, solutionToggled, sidePadding }) => {
  const [canRate, setCanRate] = useState<boolean>(false);

  useEffect(() => {
    const updatedCanRate = position.guess.color === '' && !solutionToggled;
    setCanRate(updatedCanRate);
  }, [position, solutionToggled]);

  return (
    <button 
        id={id}
        className={`flex flex-col flex-grow justify-center items-center ${sidePadding} py-3 md:my-0 md:mb-4 ${canRate ? 'bg-slate-300 text-slate-200': 'bg-slate-700 hover:bg-slate-600 text-slate-300'} font-bold rounded-md`}
        onClick={handleClick}
    >
      <div className="text-sm sm:text-lg">{children}</div>
      <div className="text-xs sm:text-sm">{time}</div>
    </button>
  );
};

export default RatingButton;
