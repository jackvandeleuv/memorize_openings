'use client';

import React, { useEffect } from "react";
import { supabaseClient } from "@/utils/supabaseClient";
import { Session } from "@supabase/supabase-js";

const HomePage: React.FC = () => {
	useEffect(() => {
		const updateDbForNewUser = async () => {
			// Check for an existing session
			let session: Session;
			const { data, error } = await supabaseClient.auth.getSession();

			// If there isn't one, return.
			if (error || !data.session) return;

			// Otherwise, ask the database to update cards and new card limits if necessary.
			const { data: limitData, error: limitError } = await supabaseClient.rpc('insert_default_user_limits');
			if (limitError) console.log(limitError);
			const { data: cardsData, error: cardsError } = await supabaseClient.rpc('insert_default_user_cards');
			if (cardsError) console.log(cardsError);
		};

		updateDbForNewUser();
	}, []);
	

	return (
		<div className="flex flex-col bg-indigo-400 w-full">
				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Welcome to Fried Liver</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-black">
					{"Fried Liver is a platform for learning chess openings, inspired by Anki's spaced repetition system. Its unique approach focuses on helping you master your favorite chess openings one move at a time, storing them in your long-term memory for stronger gameplay."}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500 text-indigo-100 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">How It Works</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl">
						{"The better you get at recognizing a position, the less often you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart."}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400 text-black gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Optimized Opening Preparation</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl">
						{"Fried Liver uses analytics from the Lichess player database to create the most useful possible opening preparation. For every move you learn, we make sure that 80% of your real-life opponents' responses are covered by your learning material."}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500 text-indigo-100 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Get Started</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl">
						{"Start your journey with Fried Liver today. Sign up for a free account and begin your journey to opening mastery!"}
					</p>
				</div>
			</div>
	  );
};

export default HomePage;