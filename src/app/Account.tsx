import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../../utils/supabaseClient";
import React, { useState, useEffect } from "react";

const Account: React.FC = () => {
    const [userDetails, setUserDetails] = useState<User | null>();

    const deleteAccount = () => {
        // Placeholder for delete account functionality
        console.log("Delete account");
    }

    const resetDatabase = () => {
        // Placeholder for reset database functionality
        console.log("Reset database");
    }

    useEffect(() => {
        const getUserDetails = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
            if (!!user) setUserDetails(user);
        };

        getUserDetails();
    }, []);

    return (
        <div className="flex items-center justify-center py-16 bg-indigo-400">
            <div className="max-w-md w-full bg-white rounded-lg">
                
                <h2 className="p-6 flex items-center justify-center text-xl font-bold text-center">Account email: {userDetails?.email}</h2>
                <p className="px-2 text-lg text-gray-700 text-center">
                    Delete or reset your account. These actions cannot be un-done!
                </p>

                <div className="flex flex-col items-center py-8">
                    <button 
                        className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        type="button"
                        onClick={deleteAccount}
                    >
                        Delete Account
                    </button>
                    <button 
                        className="mt-4 bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        type="button"
                        onClick={resetDatabase}
                    >
                        Reset Database
                    </button>
                </div>


            </div>
        </div>
    );
};

export default Account;
