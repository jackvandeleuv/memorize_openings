'use client';

import React from "react";

const About: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-500 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl">
				<h2 className="text-3xl font-bold text-center">About Fried Liver</h2>
				<p className="text-lg text-gray-700 mt-4 text-center">
					Fried Liver is an application designed to help users improve their chess skills. It teaches chess openings through spaced repetition, which is a well-studied and effective method for memorization.
				</p>
				<h3 className="text-2xl font-bold text-center mt-6">Contact Us</h3>
				<p className="text-lg text-gray-700 mt-4 text-center">
					If you have any questions or feedback, please contact us at <a href="mailto:info@friedliver.com" className="text-blue-500">info@friedliver.com</a>.
				</p>
			</div>
		</div>
	);
};

export default About;
