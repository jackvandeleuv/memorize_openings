'use client';

import React, { MouseEventHandler, useEffect } from 'react';
import DeckDropdown from './DeckDropdown';
import { supabaseClient } from '@/utils/supabaseClient';
import { DeckInfo, DecksRow } from '@/app/learn/page';


export interface DemoDecksRow {
    name: string;
    id: number;
    path: string;
}

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
            const { data, error } = await supabaseClient
                .from('demo_decks')
                .select('id, name, path')
            
            if (error) { console.error(error); return; };
            
            const newAndReviewData: DemoDecksRow[] = data;

            const updatedOption = new Map<number, DeckInfo>();
            for (let row of newAndReviewData) {
                updatedOption.set(row.id, {
                    name: row.name, 
                    newDue: 20, 
                    reviewDue: 0,
                    deck_id: row.id,
                    image_path: row.path
                });
            };
            setDeckChoice(updatedOption.keys().next().value)
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, []);

    return (
        <div className="flex items-top justify-center px-4 sm:px-0 py-4 h-full sm:flex-grow bg-slate-700">
            <div className="bg-slate-300 rounded-lg shadow-md sm:w-1/2 sm:h-1/2 p-6 mb-6 sm:p-8 sm:mx-0">
                <h2 className="sm:mb-4 text-3xl font-extrabold text-center text-slate-800">
                    Pick an opening
                </h2>
                <div className='bg-rose-400 text-slate-800 py-3 px-3 my-3 sm:my-3 rounded-md text-md'>
					<a href='https://fried-liver.com/signup' className='underline hover:text-rose-300'>Sign up</a> for a free account to save your progress.
				</div>
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
