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
    deck_id: number;
    name: string;
    total: number;
    new_cards: number;
}

export interface DeckInfo {
    name: string;
    newDue: number;
    reviewDue: number;
}


const DecksPage: React.FC = () => {
    const [activePage, setActivePage] = useState<PageOption>(PageOption.DeckPicker);
    const [deckChoice, setDeckChoice] = useState<number>(-1);
    const [deckIdOptions, setDeckIdOptions] = useState<Map<number, DeckInfo>>(new Map());
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        const getAvailableDecks = async () =>{
            const { data, error } = await supabaseClient.rpc('get_due_cards_counts');

            if (error) console.log(error);
            const decksData: DecksRow[] = data;
            console.log('Data:');
            console.log(data)
            console.log('Decks data:')
            console.log(decksData);
            const updatedOption = new Map<number, DeckInfo>();
            let newAllDecks = 0;
            let reviewAllDecks = 0;
            for (let row of decksData) {
                updatedOption.set(row.deck_id, {
                    name: row.name, 
                    newDue: row.new_cards, 
                    reviewDue: row.total - row.new_cards
                });
                newAllDecks = newAllDecks + row.new_cards;
                reviewAllDecks = reviewAllDecks + (row.total - row.new_cards);
            };
            updatedOption.set(-1, {name: 'Review All', newDue: newAllDecks, reviewDue: reviewAllDecks});
            console.log('Completed map:');
            console.log(updatedOption);
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, []);


    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event) => {
          if (event !== "SIGNED_OUT") {
            setIsSignedIn(true);
          } else {
            setIsSignedIn(false);
          }
        });
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
      }, []); 


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
            {!isSignedIn ? <></> : activePage === PageOption.DeckPicker ? 
                <DeckPicker 
                    deckIdOptions={deckIdOptions}
                    deckChoice={deckChoice}
                    setDeckChoice={setDeckChoice}
                    handleGoButton={handleGoButton}
                /> : 
                <ReviewSession 
                    ids={processDeckChoice()}
                    setActivePage={setActivePage}
                />
            }
        </div>
    );
}

export default DecksPage;