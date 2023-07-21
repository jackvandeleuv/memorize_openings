'use client';

import React from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col sm:grid sm:grid-cols-[1fr,5fr] bg-slate-700 w-full">
			<div className="px-6 pb-2 sm:pl-8 pt-6 sm:pt-8 bg-slate-700">
				<h2 className="text-3xl font-bold">Welcome</h2>
			</div>
			<div>
				<p className="px-6 pb-10 sm:pb-28 sm:pr-8 sm:pt-8 text-base sm:text-lg lg:text-xl">
				{"Fried Liver is a platform for learning chess openings with spaced repetition. Its unique approach focuses on helping you master your favorite chess openings one move at a time, storing them in your long-term memory for stronger gameplay."}
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-slate-800">
				<h2 className="text-3xl font-bold">Spaced Repetition</h2>
			</div>
			<div className='sm:pt-16 bg-slate-800'>
			<p className="px-6 pb-10 sm:pb-28 sm:pr-8 text-base sm:text-lg lg:text-xl">
				{"As you start to forget the opening positions you learned, the system will show them to you again until you know them by heart. The better you get at recognizing a position, the less often you'll see it."}
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-16 sm:pl-8 bg-slate-700">
				<h2 className="text-3xl font-bold">Unique Approach</h2>
			</div>
			<div>
			<p className="sm:pt-16 sm:pr-8 px-6 pb-10 sm:pb-28 text-base sm:text-lg lg:text-xl">
				{"Fried Liver uses analytics from the Lichess player database to create the most useful possible opening preparation. Rather than learning the openings seen in master-level play, which most players are unlikely to encounter, you'll focus on learning responses to the moves made by typical players."} 
				&nbsp;<a href='https://fried-liver.com/about' className='underline hover:text-slate-200'>Learn more.</a>
				</p>
			</div>
			<div className="px-6 pb-2 pt-8 sm:pt-14 sm:pl-8 bg-slate-800">
				<h2 className="text-3xl font-bold">Get Started</h2>
			</div>
			<div className='sm:pt-7 sm:pr-4 bg-slate-800'>
				<div className='flex flex-col'>
					<div className="flex flex-row items-center pt-1 sm:pt-8 pb-8 sm:pb-12 px-6 text-base sm:text-lg lg:text-xl gap-3 sm:gap-4">
						<Link href='/demo' className="p-1 px-6 rounded-lg bg-orange-200 text-black text-lg hover:bg-orange-100">
							Try It
						</Link>
						<Link href='/signup' className="p-1 px-4 rounded-lg bg-orange-200 text-black text-lg hover:bg-orange-100">
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	  );
};

export default HomePage;
