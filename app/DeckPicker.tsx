'use client';

import React, { MouseEventHandler } from 'react';
import { DeckInfo } from './learn/page';
import DeckDropdown from './DeckDropdown';

interface DeckPickerProps {
    deckIdOptions: Map<number, DeckInfo>;
    deckChoice: number;
    setDeckChoice: React.Dispatch<React.SetStateAction<number>>;
    handleGoButton: MouseEventHandler<HTMLButtonElement>;
}

const DeckPicker: React.FC<DeckPickerProps> = ({deckIdOptions, deckChoice, setDeckChoice, handleGoButton}) => {
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
