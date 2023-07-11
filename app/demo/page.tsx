'use client';

import React, { useEffect, useState } from "react";
import { supabaseClient } from '../../utils/supabaseClient';
import DemoReviewSession from "../DemoReviewSession";

const Demo: React.FC = () => {
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




	return (
        <>
            {!isSignedIn && (
                <DemoReviewSession />
            )}
                
        </>
	);
};

export default Demo;
