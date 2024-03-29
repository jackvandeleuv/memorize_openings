'use client';

import React, { useEffect, useState } from "react";
import { supabaseClient } from '../../utils/supabaseClient';

const AccountManagement: React.FC = () => {
	const [newPassword, setNewPassword] = useState<string>('');
	const [newEmail, setNewEmail] = useState<string>('');
	const [message, setMessage] = useState<JSX.Element>(<></>);
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);


    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event) => {
            const { data, error } = await supabaseClient.auth.getSession();
            if (error) {
                setIsSignedIn(false);
                return;
            }
            setIsSignedIn(data.session != null);
        });
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
    }, []); 


	const handleChangePassword = async (event: React.FormEvent) => {
		event.preventDefault();
		const { error } = await supabaseClient.auth.updateUser(
            { password: newPassword }
        );

		if (error) {
			setMessage(
				<div className='bg-rose-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
					{error.message}
				</div>
			);
			return;
		}

		setMessage(
			<div className='bg-green-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
				Password successfully changed!
			</div>
		);
	};

	const handleChangeEmail = async (event: React.FormEvent) => {
		event.preventDefault();
		const { error } = await supabaseClient.auth.updateUser({ email: newEmail });

		if (error) {
			setMessage(
				<div className='bg-rose-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
					{error.message}
				</div>
			);
			return;
		}

		setMessage(
			<div className='bg-green-400 text-black py-3 px-3 mt-3 rounded-md text-sm'>
				Email successfully changed!
			</div>
		);
	};

	return (
        <>
            {isSignedIn && (
                <div className="flex flex-grow items-top sm:items-center justify-center sm:py-16 bg-slate-700">
                    <div className="mx-4 mb-16 max-h-[375px] sm:max-h-[1/3] sm:mb-0 sm:mx-0 space-y-8 bg-slate-300 text-slate-800 p-8 sm:p-10 rounded-xl">
                        <div className="flex text-center justify-center text-3xl font-extrabold">
                            Account Management
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleChangeEmail}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-">
                            <div className='pb-2'>
                            <label htmlFor="new-email" className="sr-only">
                                New email
                            </label>
                            <input
                                id="new-email"
                                name="new-email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-slate-200 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="New email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            </div>
                            <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                            >
                                Change Email
                            </button>
                            </div>
                        </div>
                        </form>
                        <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className='pb-2'>
                            <label htmlFor="new-password" className="sr-only">
                                New password
                            </label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-slate-200 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            </div>
                            <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                            >
                                Change Password
                            </button>
                            </div>
                        </div>
                        </form>
                        <div>
                        {message}
                        </div>
                    </div>
                </div>
            )}
        </>
	);
};

export default AccountManagement;
