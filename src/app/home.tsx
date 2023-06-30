'use client';

import React from "react";

const HomePage: React.FC = () => {
	return (
		<div className="flex items-center justify-center bg-indigo-400 py-12 px-4 sm:px-6 lg:px-8 w-full">
		  <div className="max-w-md w-full space-y-4 sm:space-y-6 lg:space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl">
			<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Welcome to Fried Liver</h2>
			<p className="text-base sm:text-lg lg:text-xl text-gray-700 mt-2 sm:mt-3 lg:mt-4 text-center">
			  Fried Liver is an application inspired by Anki, tailored for chess enthusiasts to review chess positions in various openings.
			</p>
			<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mt-4 sm:mt-6 lg:mt-8">Features</h3>
			<p className="text-base sm:text-lg lg:text-xl text-gray-700 mt-2 sm:mt-3 lg:mt-4 text-center">
			  With Fried Liver, you can practice and memorize your favorite chess openings, learn new ones, and test your knowledge with quizzes and puzzles.
			</p>
			<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mt-4 sm:mt-6 lg:mt-8">How it Works</h3>
			<p className="text-base sm:text-lg lg:text-xl text-gray-700 mt-2 sm:mt-3 lg:mt-4 text-center">
			  Just like Anki, Fried Liver uses spaced repetition to help you remember chess openings. The more you get a position right, the less you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart.
			</p>
			<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mt-4 sm:mt-6 lg:mt-8">Get Started</h3>
			<p className="text-base sm:text-lg lg:text-xl text-gray-700 mt-2 sm:mt-3 lg:mt-4 text-center">
			  Ready to level up your chess game? Sign up today and start mastering chess openings with Fried Liver.
			</p>
		  </div>
		</div>
	  );
};

export default HomePage;
