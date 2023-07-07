import React from 'react';
import { Scheduler } from './Scheduler';
import { Position } from './ReviewSession';

interface DeckInfoPanelProps {
	id: string;
    scheduler: Scheduler;
    solutionToggled: boolean;
	position: Position;
};

const DeckInfoPanel: React.FC<DeckInfoPanelProps> = ({ id, scheduler, solutionToggled, position }) => {
	return (
		<div className="p-4 bg-indigo-600 rounded-md">
			<div className={`text-center text-xl font-bold text-white`}>
				{position.game.turn() === 'w' && !solutionToggled ? 'White to Move' : 'Black to Move'}
			</div>
			
			<div className="flex flex-col py-4 w-full">
				<div className="p-1 text-center text-lg font-bold text-white bg-indigo-500 rounded-sm">
					{`New: ${scheduler.getNewQueueSize()}`}
				</div>
				<div className="p-1 text-center text-lg font-bold text-white bg-indigo-400 rounded-sm">
					{`Review: ${scheduler.getReviewQueueSize()}`}
				</div>
			</div>
		</div>
	);
};

export default DeckInfoPanel;
