'use client';

import React from "react";
import MenuBar from "./MenuBar";
import Footer from "./Footer";

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col bg-indigo-400 w-full">
				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Welcome to Fried Liver</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
					{"Fried Liver is an innovative platform for learning chess openings, inspired by Anki's spaced repetition system. Its unique approach focuses on helping you master your favorite chess openings one move at a time, storing them in your long-term memory for a stronger gameplay."}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">How It Works</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						{"The better you get at recognizing a position, the less often you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart."}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Optimized Opening Preparation</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						{"Fried Liver uses analytics from the Lichess player API to create the most useful possible opening preparation. For every move you learn, we make sure that 80% of your real-life opponents' responses are covered by your learning material"}
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500 gap-2">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Get Started</h2>
					<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						{"Start your journey with Fried Liver today. Sign up for a free account and begin your journey to opening mastery!"}
					</p>
				</div>
			</div>
	  );
};

export default HomePage;
