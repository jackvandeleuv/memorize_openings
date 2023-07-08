'use client';

import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import DeckPicker from '../DeckPicker';
import ReviewSession from '../ReviewSession';

export type PageOption = 'DeckPicker' | 'Review'


interface DecksRow {
    deck_id: number;
    name: string;
    total: number;
    new_cards: number;
    all_new_cards: number;
    image_path: string;
}

interface TotalsRow {
    id: number;
    name: string;
    total: number;
}

export interface DeckInfo {
    deck_id: number;
    name: string;
    newDue: number;
    reviewDue: number;
    totalCards: number;
    image_path: string;
}


const DecksPage: React.FC = () => {
    const [activePage, setActivePage] = useState<PageOption>('DeckPicker');
    const [deckChoice, setDeckChoice] = useState<number>(-1);
    const [deckIdOptions, setDeckIdOptions] = useState<Map<number, DeckInfo>>(new Map());
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        const getAvailableDecks = async () => {
            const { data, error } = await supabaseClient.rpc('get_due_cards_counts');
            if (error) { console.error(error); return; };
            const { data: data2, error: error2 } = await supabaseClient.rpc('get_total_card_counts');
            if (error2) { console.error(error2); return; };
            
            const newAndReviewData: DecksRow[] = data;
            const totalsData: TotalsRow[] = data2;

            const updatedOption = new Map<number, DeckInfo>();
            let newAllDecks = 0;
            let reviewAllDecks = 0;
            let totalAllDecks = 0;

            for (let row of newAndReviewData) {
                updatedOption.set(row.deck_id, {
                    name: row.name, 
                    newDue: row.new_cards, 
                    reviewDue: row.total - row.all_new_cards,
                    totalCards: 0,
                    deck_id: row.deck_id,
                    image_path: row.image_path
                });
                newAllDecks = newAllDecks + row.new_cards;
                reviewAllDecks = reviewAllDecks + (row.total - row.all_new_cards);
            };

            for (let row of totalsData) {
                const deck = updatedOption.get(row.id)
                if (!deck) updatedOption.set(row.id, {
                    name: row.name, 
                    newDue: 0, 
                    reviewDue: 0, 
                    totalCards: 
                    row.total, 
                    deck_id: row.id,
                    image_path: ''
                });
                else deck.totalCards = row.total;
                totalAllDecks = totalAllDecks + row.total;
            }
            console.log(updatedOption)
            setDeckChoice(updatedOption.keys().next().value)
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, []);


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


    function processDeckChoice(): number[] {
        if (deckChoice !== -1) return [deckChoice];
        let choices = Array.from(deckIdOptions.keys());
        choices = choices.filter(item => item !== -1);
        return choices;
    }

    return (
        <>
            {!isSignedIn ? <></> : activePage === 'DeckPicker' ? 
                <DeckPicker 
                    deckIdOptions={deckIdOptions}
                    deckChoice={deckChoice}
                    setDeckChoice={setDeckChoice}
                    handleGoButton={handleGoButton}
                /> : 
                <ReviewSession 
                    ids={processDeckChoice()}
                    setActivePage={setActivePage}
                    deckIdOptions={deckIdOptions}
                />
            }
        </>
    );
}

export default DecksPage;