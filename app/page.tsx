'use client';

import React, { useEffect } from "react";
import { supabaseClient } from "@/utils/supabaseClient";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";

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
		<div className="flex flex-col sm:grid sm:grid-cols-[1fr,5fr] bg-indigo-400 w-full">
			<div className="px-6 pb-2 sm:pl-8 pt-4 sm:pt-8 bg-indigo-400">
				<h2 className="text-3xl font-bold">Welcome</h2>
			</div>
			<div>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 sm:pt-8 text-base sm:text-lg lg:text-xl">
				{"Fried Liver is a platform for learning chess openings with spaced repetition. Its unique approach focuses on helping you master your favorite chess openings one move at a time, storing them in your long-term memory for stronger gameplay."}
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-indigo-500">
				<h2 className="text-3xl font-bold">Learn Openings</h2>
			</div>
			<div className='sm:pt-16 bg-indigo-500'>
			<p className="px-6 pb-10 sm:pb-28 sm:pr-8 text-base sm:text-lg lg:text-xl">
				{"The better you get at recognizing a position, the less often you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart."}
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-indigo-400">
				<h2 className="text-3xl font-bold">Optimized Preparation</h2>
			</div>
			<div>
			<p className="sm:pt-16 sm:pr-8 px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
				{"Fried Liver uses analytics from the Lichess player database to create the most useful possible opening preparation. For every move you learn, we make sure that 80% of your real-life opponents' responses are covered by your learning material."}
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-14 sm:pl-8 bg-indigo-500">
				<h2 className="text-3xl font-bold">Get Started</h2>
			</div>
			<div className='sm:pt-7 sm:pr-4 bg-indigo-500'>
				<div className='flex flex-col'>
					<div className="flex items-center pt-1 sm:pt-8 sm:pb-12 px-6 text-base sm:text-lg lg:text-xl ">
						<Link href='/signup' className="p-1 px-4 rounded-lg bg-orange-200 text-black text-lg hover:bg-orange-100">
							Sign Up for a Free Account
						</Link>
					</div>
				</div>
			</div>
		</div>
	  );
};

export default HomePage;
