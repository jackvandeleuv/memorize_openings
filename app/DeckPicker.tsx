'use client';

import React, { useState, ChangeEvent, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { DeckInfo } from './learn/page';

interface DeckPickerProps {
    deckIdOptions: Map<number, DeckInfo>;
    deckChoice: number;
    setDeckChoice: React.Dispatch<React.SetStateAction<number>>;
    handleGoButton: MouseEventHandler<HTMLButtonElement>;
}

const DeckPicker: React.FC<DeckPickerProps> = ({deckIdOptions, deckChoice, setDeckChoice, handleGoButton}) => {

    const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
        const numericChoice = Number(event.currentTarget.value);
        if (!isNaN(numericChoice)) setDeckChoice(numericChoice);
    };

    return (
        <div className="flex items-center justify-center py-20 bg-indigo-400">
            <div className="bg-white rounded-lg shadow-md max-w-lg w-full p-4 sm:p-8 mx-2 sm:mx-0">
                <h2 className="mb-8 text-2xl font-semibold text-center text-gray-700">
                    Pick an opening
                </h2>
                <div className="relative mb-8">
    
                    <select 
                        className="block w-full p-3 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700 text-gray-700 font-sans text-xs sm:text-lg"
                        value={deckChoice.toString()} 
                        onChange={handleSelection}
                    >
                        {Array.from(deckIdOptions.entries()).map(([key, val]) => 
                        <option key={key} value={key}>{val.name + ' (New: ' + val.newDue + ' | Review: ' + val.reviewDue + ' | Total: ' + val.totalCards + ')'}</option>
                        )}
                    </select>
    
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
