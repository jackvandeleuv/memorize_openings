'use client';

import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import DemoDeckPicker from '../components/panels/DemoDeckPicker';
import DemoReviewSession from '../DemoReviewSession';

export type PageOption = 'DeckPicker' | 'Review'


export interface DecksRow {
    deck_id: number;
    name: string;
    neverseen_below_limit: number;
    other_due_cards: number;
    image_path: string;
}

export interface DeckInfo {
    deck_id: number;
    name: string;
    newDue: number;
    reviewDue: number;
    image_path: string;
}


const DemoDecksPage: React.FC = () => {
    const [activePage, setActivePage] = useState<PageOption>('DeckPicker');
    const [deckChoice, setDeckChoice] = useState<number>(-1);
    const [deckIdOptions, setDeckIdOptions] = useState<Map<number, DeckInfo>>(new Map());
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event) => {
            const { data, error } = await supabaseClient.auth.getSession();
            if (error) {
                setIsSignedIn(false);
                return;
            }
            setIsSignedIn(data.session != null);
        });
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
      }, []); 


    const handleGoButton = () => {
        setActivePage('Review');
    }


    return (
        <>
            {isSignedIn ? <></> : activePage === 'DeckPicker' ? 
                <DemoDeckPicker 
                    deckIdOptions={deckIdOptions}
                    setDeckIdOptions={setDeckIdOptions}
                    deckChoice={deckChoice}
                    setDeckChoice={setDeckChoice}
                    handleGoButton={handleGoButton}
                /> : 
                <DemoReviewSession 
                    id={deckChoice}
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            }
        </>
    );
}

export default DemoDecksPage;