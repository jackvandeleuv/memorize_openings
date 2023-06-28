'use client';

import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import { User } from "@supabase/supabase-js";

const Account: React.FC = () => {
    const [userDetails, setUserDetails] = useState<User | null | undefined>();

    // useEffect(() => {
    //     const userTest = async () => {
    //         const { data: user, error } = await supabaseClient.auth.getUser();
    //         if (error) {
    //             console.error("Error fetching user details:", error);
    //             return;
    //         }
    //         if (user !== null && user !== undefined) {
    //             setUserDetails(user.user);
    //         }
    //     };

    //     userTest();
    // }, [supabaseClient]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-blue-500 py-12 px-4 sm:px-6 lg:px-8">
			Account placeholder
            {userDetails?.email}
		</div>
	);
};

export default Account;
