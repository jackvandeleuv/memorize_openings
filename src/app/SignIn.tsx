	// useEffect(() => {
	// 	const signIn = async () => {
	// 		const { data, error } = await supabaseClient.auth.signInWithPassword({
	// 			email: process.env.TEST_USERNAME!,
	// 			password: process.env.TEST_PASSWORD!,
	// 		})
	
	// 		if (error) {
	// 			console.error('Error signing in:', error.message)
	// 		}
	// 	}

	// 	signIn();
	// }, [])