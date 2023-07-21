'use client';

import React from "react";

const About: React.FC = () => {
	return (
		<div className="flex flex-col sm:grid sm:grid-cols-[1fr,5fr] bg-slate-800 w-full">
			<div className="px-6 pb-2 sm:pl-8 pt-6 sm:pt-8 bg-slate-800">
				<h2 className="text-3xl font-bold">About Fried Liver</h2>
			</div>
			<div>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 sm:pt-8 text-base sm:text-lg lg:text-xl">
					Fried Liver is an application designed to help you improve your knowledge of chess openings. It achieves this through spaced repetition, which is a well-studied and effective method for memorization. Fried Liver uses a lightly modified version of Anki&apos;s implementation of the SuperMemo 2 spaced-repetition algorithm. Learn more about <a href='https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html' className='underline hover:text-slate-200'>the original algorithm.</a>
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-slate-700">
				<h2 className="text-3xl font-bold">Achieving Comprehensive Opening Coverage</h2>
			</div>
			<div className='sm:pt-16 bg-slate-700'>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 text-base sm:text-lg lg:text-xl">
						The challenge with most traditional methods of learning opening theory is that the positions you study will rarely be seen in an actual game. For example, if the position you are studying occurs at move 10, then to reach that position requires both you and your opponent to each make five specific moves. For most chess players, this won&apos;t be a reality. Even if you are well-prepared, chances are your opponent won&apos;t be.
						<br /><br />
						Fried Liver addresses this issue by using data from Lichess to find the moves you are most likely to encounter. The current set of opening decks each offer around 80% coverage, meaning that you are learning how to respond to 80% of your opponent&apos;s potential moves. For example, if you are studying the Open Game deck, you&apos;ll learn the highest-rated Stockfish response for each of 1...e5, 1...c5, 1...e6, and 1...d5, which covers black&apos;s response in over 80% of games. Soon, you&apos;ll be studying 1. e4 e5 2. Nf6, at which point you&apos;ll learn one response each for 2...Nc6 and 2...d6: the two moves which black makes here 80% of the time. Currently, this is calibrated to 1600-level Lichess players, although future versions will offer more options for opponent strength.
						<br /><br />
						Why not learn everything? Unfortunately, if you wanted to learn every possible response by your opponent, you would have to memorize a few million positions for every opening. By focusing on 80% coverage, we cut that number down dramatically to a few thousand or hundred.
						<br /><br />
						The downside is that the likelihood of your opponent making a move you haven&apos;t studied increases as the game goes on. If, on the third move, your opponent has a 80% chance of making a familiar move, then in 20% of games your opponent will surprise you. Let&apos;s say that for each of these moves by your opponent, you learn a response. Now, your opponent moves again (move 5), and the probability you are still within your opening preparation drops to 64% (0.8 * 0.8). By move 13, only 25% of your opponents moves will be familiar to you. However, that is still ten moves where you are making perfect moves, and your opponent can blunder!
				</p>
			</div>
		</div>
	);
};

export default About;
