'use client';

import React from "react";

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col bg-indigo-400 w-full">
				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Welcome to Fried Liver</h2>
					<p className="px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						Fried Liver is an application inspired by Anki, tailored for chess enthusiasts to review chess positions in various openings.
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Features</h2>
					<p className="px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						With Fried Liver, you can practice and memorize your favorite chess openings, learn new ones, and test your knowledge with quizzes and puzzles.
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">How it Works</h2>
					<p className="px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						Just like Anki, Fried Liver uses spaced repetition to help you remember chess openings. The more you get a position right, the less you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart.
					</p>
				</div>

				<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400">
					<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Get Started</h2>
					<p className="px-6 text-base sm:text-lg lg:text-xl text-gray-700">
						Ready to level up your chess game? Sign up today and start mastering chess openings with Fried Liver.
					</p>
				</div>
			</div>
	  );
};

export default HomePage;
