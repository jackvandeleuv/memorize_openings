'use client';

import React, { useState, useEffect } from 'react';
import DeckPicker from './DeckPicker';
import { supabaseClient } from '../../utils/supabaseClient';
import { Link } from 'react-router-dom';
import ReviewSession from './ReviewSession';
import { getRandomValues } from 'crypto';

export enum PageOption {
    DeckPicker,
    Review
}

interface DecksRow {
    id: number;
    name: string;
}


const DecksPage: React.FC = () => {
    const [activePage, setActivePage] = useState<PageOption>(PageOption.DeckPicker);
    const [deckChoice, setDeckChoice] = useState<number>(-1);
    const [deckIdOptions, setDeckIdOptions] = useState<Map<number, string>>(new Map([[-1, 'Review all']]));

    useEffect(() => {
        const getAvailableDecks = async () =>{
            const { data, error } = await supabaseClient.from('decks')
                .select(`id, name`);

            if (error) console.log(error);
            if (!data) throw new Error('Supabase returned no data.');
            const decksData: DecksRow[] = data;

            const updatedOption = new Map<number, string>(deckIdOptions);
            for (let row of decksData) updatedOption.set(row.id, row.name);
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, [deckIdOptions])


    const handleGoButton = () => {
        setActivePage(PageOption.Review);
    }


    function processDeckChoice(): number[] {
        if (deckChoice !== -1) return [deckChoice];
        let choices = Array.from(deckIdOptions.keys());
        choices = choices.filter(item => item !== -1);
        return choices;
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            {activePage === PageOption.DeckPicker ? 
                <DeckPicker 
                    deckIdOptions={deckIdOptions}
                    deckChoice={deckChoice}
                    setDeckChoice={setDeckChoice}
                    handleGoButton={handleGoButton}
                /> : 
                <ReviewSession 
                    ids={processDeckChoice()}
                />
            }
        </div>
    );
}

export default DecksPage;