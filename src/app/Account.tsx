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
        <div className="min-h-screen flex items-center justify-center bg-blue-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl">
                <h2 className="text-3xl font-bold text-center">Account: {userDetails?.email}</h2>
                <p className="text-lg text-gray-700 mt-4 text-center">
                    Here you can manage your account settings and data.
                </p>
                <div className="flex flex-col items-center mt-6">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        type="button"
                        onClick={deleteAccount}
                    >
                        Delete Account
                    </button>
                    <button 
                        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
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
