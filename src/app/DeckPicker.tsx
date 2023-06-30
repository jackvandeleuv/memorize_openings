'use client';

import React, { useState, ChangeEvent, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { PageOption, DeckInfo } from './learn';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded shadow-md max-w-md w-full p-6">
                <h2 className="mb-4 text-xl font-bold text-center text-gray-700">
                Pick an opening
                </h2>
                <div className="relative">

                <select 
                    className="block w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={deckChoice.toString()} 
                    onChange={handleSelection}
                >
                    {Array.from(deckIdOptions.entries()).map(([key, val]) => 
                    <option key={key} value={key}>{val.name + ' (New: ' + val.newDue + ' | Review: ' + val.reviewDue + ' | Total: ' + val.totalCards + ')'}</option>
                    )}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707 4-4-4-4-.707.707L12.586 10H2v1h10.586l-3.293 1.95z" />
                    </svg>
                </div>
                </div>
                <button 
                    className="w-full p-2 mt-4 text-white bg-blue-500 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
                    onClick={handleGoButton}
                >
                    Go
                </button>
                <p className="mt-6 text-sm text-center text-gray-600">
                    Review all shows the cards from all active openings.
                </p>
            </div>
        </div>
    );
}

export default DeckPicker;
