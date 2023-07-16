'use client';

import React, { useState } from "react";
import { supabaseClient } from '../../utils/supabaseClient';

const SignIn: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [userMessage, setUserMessage] = useState<JSX.Element>(<></>);

	const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error(error)
      setUserMessage(
        <div className='bg-rose-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
          {error.message}
        </div>
      );
      setEmail('');
      setPassword('');
      return;
    }

    setEmail('');
    setPassword('');

    setUserMessage(
      <div className='bg-green-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
        Success!
      </div>
    );
	};

	
  return (
    <div className="flex items-center justify-center py-16 bg-slate-700">
      <div className="mx-2 sm:mx-0 max-w-md w-full space-y-8 bg-slate-300 p-10 rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-slate-200 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 bg-slate-200 placeholder-slate-500 text-slate-800 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
			<div>
				{userMessage}
			</div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;