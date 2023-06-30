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

interface TotalsRow {
    id: number;
    name: string;
    total: number;
}

export interface DeckInfo {
    name: string;
    newDue: number;
    reviewDue: number;
    totalCards: number;
}


const DecksPage: React.FC = () => {
    const [activePage, setActivePage] = useState<PageOption>(PageOption.DeckPicker);
    const [deckChoice, setDeckChoice] = useState<number>(-1);
    const [deckIdOptions, setDeckIdOptions] = useState<Map<number, DeckInfo>>(new Map());
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        const getAvailableDecks = async () =>{
            const { data, error } = await supabaseClient.rpc('get_due_cards_counts');
            if (error) {console.log(error); return;};
            const { data: data2, error: error2 } = await supabaseClient.rpc('get_total_card_counts');
            if (error2) {console.log(error2); return;};

            console.log('Second query data:')
            console.log(data2)

            const newAndReviewData: DecksRow[] = data;
            const totalsData: TotalsRow[] = data2;

            console.log('Totals data')
            console.log(totalsData)

            const updatedOption = new Map<number, DeckInfo>();
            let newAllDecks = 0;
            let reviewAllDecks = 0;
            let totalAllDecks = 0;
            for (let row of newAndReviewData) {
                updatedOption.set(row.deck_id, {
                    name: row.name, 
                    newDue: row.new_cards, 
                    reviewDue: row.total - row.new_cards,
                    totalCards: 0
                });
                newAllDecks = newAllDecks + row.new_cards;
                reviewAllDecks = reviewAllDecks + (row.total - row.new_cards);
            };
            for (let row of totalsData) {
                console.log(totalsData)
                console.log('Unpacking second query:')
                console.log(row)
                console.log(updatedOption.get(row.id))
                const deck = updatedOption.get(row.id)
                if (!deck) updatedOption.set(row.id, {name: row.name, newDue: 0, reviewDue: 0, totalCards: row.total});
                else deck.totalCards = row.total;
                totalAllDecks = totalAllDecks + row.total;
            }
            updatedOption.set(-1, {name: 'Review All', newDue: newAllDecks, reviewDue: reviewAllDecks, totalCards: totalAllDecks});
            setDeckIdOptions(updatedOption);
        }

        getAvailableDecks();
    }, [activePage]);


    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event) => {
            const { data, error } = await supabaseClient.auth.getSession();
            if (error) {
                setIsSignedIn(false);
                return
            }
            setIsSignedIn(data.session != null);
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
        <>
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
                    deckIdOptions={deckIdOptions}
                    setDeckIdOptions={setDeckIdOptions}
                />
            }
        </>
    );
}

export default DecksPage;