'use client';

import React from "react";

const About: React.FC = () => {
	return (
		<div className="flex flex-col bg-indigo-400 w-full">

			<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-500">
				<h2 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">About Fried Liver</h2>
				<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
					Fried Liver is an application designed to help users improve their chess skills. It teaches chess openings through spaced repetition, which is a well-studied and effective method for memorization.
				</p>

			</div>

			<div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[400px_minmax(500px,_1fr)] bg-indigo-400">
				<h3 className="flex justify-center items-center px-10 text-xl sm:text-2xl lg:text-3xl font-bold text-center">Contact Us</h3>
				<p className="flex items-center px-6 text-base sm:text-lg lg:text-xl text-gray-700">
					If you have any questions or feedback, please contact us at <a href="mailto:info@friedliver.com" className="text-indigo-400">info@friedliver.com</a>.
				</p>
			</div>
		</div>
	);
};

export default About;
