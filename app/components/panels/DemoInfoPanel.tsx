import { Scheduler } from '@/app/Scheduler';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

interface NeverseenAndDue {
	neverseen_below_limit: number;
	other_due_cards: number;
}

interface DeckInfoPanelProps {
	scheduler: Scheduler | undefined;
	isLoaded: boolean;
};

const DemoInfoPanel: React.FC<DeckInfoPanelProps> = ({ scheduler, isLoaded }) => {
	const [queueSize, setQueueSize] = useState<NeverseenAndDue>({neverseen_below_limit: 0, other_due_cards: 0});

	useEffect(() => {
		const updateCardCounts = async () => {
            if (!scheduler) return;
			const cards = scheduler.getCards();
            let newCount = 0;
            let revCount = 0;

            for (let card of cards) {
                if (card.neverSeen) {
                    newCount = newCount + 1;
                } else {
                    revCount = revCount + 1;
                }
            };

            setQueueSize({neverseen_below_limit: newCount, other_due_cards: revCount});
		};

		updateCardCounts();
	}, [scheduler])
	

	return (
		<div className="rounded-md p-4 md:p-0 bg-slate-800 md:bg-slate-700">
			<div className={`text-center text-xl font-bold text-slate-300`}>
				{
					isLoaded ? 'Positions to Study' :
					<BeatLoader color={"#FFFFFF"} loading={!isLoaded} size={12} />
				}
			</div>
			
			<div className="flex flex-col py-4 w-full">
				<div className="p-1 text-center text-lg font-bold text-white bg-slate-800 md:bg-slate-700 rounded-sm">
					{`New: ${!scheduler ? '0' : queueSize.neverseen_below_limit}`}
				</div>
				<div className="p-1 text-center text-lg font-bold text-white bg-slate-700 rounded-sm">
					{`Review: ${!scheduler ? '0' : queueSize.other_due_cards}`}
				</div>
			</div>
		</div>
	);
};

export default DemoInfoPanel;
