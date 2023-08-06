'use client';

import React, { MouseEventHandler, useEffect } from 'react';
import DeckDropdown from './DeckDropdown';
import { supabaseClient } from '@/utils/supabaseClient';
import { DeckInfo, DecksRow } from '@/app/learn/page';

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
    }, [setDeckChoice, setDeckIdOptions]);

    return (
        <div className="flex items-top justify-center px-4 sm:px-0 py-4 h-full sm:flex-grow bg-slate-700">
            <div className="bg-slate-300 rounded-lg shadow-md w-full sm:w-1/2 sm:h-1/2 p-6 sm:p-8 sm:mx-0">
                <h2 className="mb-4 text-2xl font-semibold text-center text-slate-800">
                    Pick an opening
                </h2>
                <div className="relative mb-2 sm:mb-0">
                    <DeckDropdown 
                        deckIdOptions={deckIdOptions}
                        deckChoice={deckChoice}
                        setDeckChoice={setDeckChoice}
                    />
    
                </div>
                <button 
                    className="w-full p-3 sm:px-3 sm:pb-3 sm:pt-3 mt-2 sm:mt-4 text-lg text-slate-300 bg-slate-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 hover:bg-slate-600"
                    onClick={handleGoButton}
                >
                    Go
                </button>
            </div>
        </div>
    );
    
    
}

export default DeckPicker;
