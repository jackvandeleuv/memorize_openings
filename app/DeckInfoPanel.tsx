import React, { useEffect, useState } from 'react';
import { Scheduler } from './Scheduler';
import { Position } from './ReviewSession';
import { BeatLoader } from 'react-spinners';
import { supabaseClient } from '@/utils/supabaseClient';

interface NeverseenAndDue {
	neverseen_below_limit: number;
	other_due_cards: number;
}

interface DeckInfoPanelProps {
	deckId: number;
    scheduler: Scheduler | undefined;
    solutionToggled: boolean;
	position: Position;
	isLoaded: boolean;
};

const DeckInfoPanel: React.FC<DeckInfoPanelProps> = ({ deckId, scheduler, solutionToggled, position, isLoaded }) => {
	const [queueSize, setQueueSize] = useState<NeverseenAndDue>({neverseen_below_limit: 0, other_due_cards: 0});

	useEffect(() => {
		const updateCardCounts = async () => {
			const { data, error } = await supabaseClient.rpc('get_neverseen_and_due', { _current_deck_id: deckId });
			if (error) { console.error(error); return; }

			const neverseenAndDue: NeverseenAndDue[] = data;
			let updatedQueueSize = neverseenAndDue[0]
			if (updatedQueueSize === undefined || updatedQueueSize === null) updatedQueueSize = {neverseen_below_limit: 0, other_due_cards: 0};
			setQueueSize(updatedQueueSize);
		};

		updateCardCounts();
	}, [scheduler, deckId])
	

	return (
		<div className="rounded-md p-4 md:p-0 bg-indigo-600 md:bg-indigo-500">
			<div className={`text-center text-xl font-bold text-white`}>
				{
					isLoaded ? 'Positions to Study' :
					<BeatLoader color={"#FFFFFF"} loading={!isLoaded} size={12} />
				}
			</div>
			
			<div className="flex flex-col py-4 w-full">
				<div className="p-1 text-center text-lg font-bold text-white bg-indigo-500 md:bg-indigo-600 rounded-sm">
					{`New: ${!scheduler ? '0' : queueSize.neverseen_below_limit}`}
				</div>
				<div className="p-1 text-center text-lg font-bold text-white bg-indigo-400 rounded-sm">
					{`Review: ${!scheduler ? '0' : queueSize.other_due_cards}`}
				</div>
			</div>
		</div>
	);
};

export default DeckInfoPanel;
