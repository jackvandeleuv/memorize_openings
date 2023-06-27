'use client';

import React from "react";

const HomePage: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-500 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl">
				<h2 className="text-3xl font-bold text-center">Welcome to Fried Liver</h2>
				<p className="text-lg text-gray-700 mt-4 text-center">
					Fried Liver is an application inspired by Anki, tailored for chess enthusiasts to review chess positions in various openings.
				</p>
				<h3 className="text-2xl font-bold text-center mt-6">Features</h3>
				<p className="text-lg text-gray-700 mt-4 text-center">
					With Fried Liver, you can practice and memorize your favorite chess openings, learn new ones, and test your knowledge with quizzes and puzzles.
				</p>
				<h3 className="text-2xl font-bold text-center mt-6">How it Works</h3>
				<p className="text-lg text-gray-700 mt-4 text-center">
					Just like Anki, Fried Liver uses spaced repetition to help you remember chess openings. The more you get a position right, the less you'll see it. But if you get it wrong, we'll show it again soon, until you know it by heart.
				</p>
				<h3 className="text-2xl font-bold text-center mt-6">Get Started</h3>
				<p className="text-lg text-gray-700 mt-4 text-center">
					Ready to level up your chess game? Sign up today and start mastering chess openings with Fried Liver.
				</p>
			</div>
		</div>
	);
};

export default HomePage;
