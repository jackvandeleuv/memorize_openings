'use client';

import React, { MouseEventHandler, useEffect } from 'react';
import { DeckInfo, DecksRow } from './learn/page';
import DeckDropdown from './DeckDropdown';
import { supabaseClient } from '@/utils/supabaseClient';

interface DeckPickerProps {
    deckIdOptions: Map<number, DeckInfo>;
    setDeckIdOptions: React.Dispatch<React.SetStateAction<Map<number, DeckInfo>>>;
    deckChoice: number;
    setDeckChoice: React.Dispatch<React.SetStateAction<number>>;
    handleGoButton: MouseEventHandler<HTMLButtonElement>;
}

const DeckPicker: React.FC<DeckPickerProps> = ({deckIdOptions, setDeckIdOptions, deckChoice, setDeckChoice, handleGoButton}) => {

    useEffect(() => {
        const getAvailableDecks = async () => {
            const { data: updateData, error: updateError } = await supabaseClient.rpc('update_new_cards_and_limits');
            if (updateError) {console.error(updateError); return;};

            const { data, error } = await supabaseClient.rpc('get_neverseen_and_due_no_params');
            if (error) {console.error(error); return; };
            
            const newAndReviewData: DecksRow[] = data;

            const updatedOption = new Map<number, DeckInfo>();
            for (let row of newAndReviewData) {
                updatedOption.set(row.deck_id, {
                    name: row.name, 
                    newDue: row.neverseen_below_limit, 
                    reviewDue: row.other_due_cards,
                    deck_id: row.deck_id,
                    image_path: row.image_path
                });
            };

            setDeckChoice(updatedOption.keys().next().value)
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, []);

    return (
        <div className="flex items-center justify-center py-10 sm:py-20 bg-indigo-400">
            <div className="bg-white rounded-lg shadow-md max-w-lg w-full p-4 sm:p-8 mx-2 sm:mx-0">
                <h2 className="mb-4 text-2xl font-semibold text-center text-black">
                    Pick an opening
                </h2>
                <div className="relative mb-2">
                    <DeckDropdown 
                        deckIdOptions={deckIdOptions}
                        deckChoice={deckChoice}
                        setDeckChoice={setDeckChoice}
                    />
    
                </div>
                <button 
                    className="w-full p-3 mt-4 text-lg text-white bg-indigo-500 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-600"
                    onClick={handleGoButton}
                >
                    Go
                </button>
            </div>
        </div>
    );
    
    
}

export default DeckPicker;
