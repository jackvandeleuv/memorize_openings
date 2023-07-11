'use client';

import React from "react";

const About: React.FC = () => {
	return (
		<div className="flex flex-col sm:grid sm:grid-cols-[1fr,5fr] bg-indigo-500 w-full">
			<div className="px-6 pb-2 sm:pl-8 pt-4 sm:pt-8 bg-indigo-500">
				<h2 className="text-3xl font-bold">About Fried Liver</h2>
			</div>
			<div>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 sm:pt-8 text-base sm:text-lg lg:text-xl">
					Fried Liver is an application designed to help users improve their chess skills. It teaches chess openings through spaced repetition, which is a well-studied and effective method for memorization. Fried Liver uses Anki&apos;s implementation of the SuperMemo 2 spaced-repetition algorithm. Learn more about <a href='https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html' className='underline hover:text-indigo-300'>the original algorithm.</a>
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-indigo-400">
				<h2 className="text-3xl font-bold">Achieving Comprehensive Opening Coverage</h2>
			</div>
			<div className='sm:pt-16 bg-indigo-400'>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 text-base sm:text-lg lg:text-xl">
						The challenge with most traditional methods of learning opening theory is that the positions you study will rarely be seen in an actual game. For example, if the position you are studying occurs at move 10, then to reach that position requires both you and your opponent to each make five specific moves. For most chess players, this won&apos;t be a reality. Even if you are well-prepared, chances are your opponent won&apos;t be.
						<br /><br />
						Fried Liver addresses this issue by using data from Lichess to find the moves you are most likely to encounter. The current set of opening decks each offer 80% coverage, meaning that for any given move you practice, you&apos;ll also be learning enough variations to cover 80% of the most popular ways for your opponents to respond. Currently, this is calibrated to 1600-level Lichess players, although future versions will offer more options for hypothetical opponent strength.
						<br /><br />
						If you wanted to learn every possible response by your opponent, you would have to memorize a few million positions for every opening. By focusing on 80% coverage, we cut that number down dramatically to a few thousand (or hundred in many cases).
						<br /><br />
						The downside is that the likelihood of your opponent making a move you haven&apos;t studied increases as the game goes on. If, on the third move, your opponent has a 80% chance of making a familiar move, then in 20% of games your opponent will surprise you. Let&apos;s say that for each of these moves by your opponent, you learn a response. Now, your opponent moves again (move 5), and the probability you are still within your opening preparation drops to 64% (0.8 * 0.8). By move 13, only 25% of your opponents moves will be familiar to you. However, that is still ten moves where you are making perfect moves, and your opponent can blunder!
				</p>
			</div>
		</div>
	);
};

export default About;
