// Import strategy
import { Strategy } from 'passport-github'

// Passport authentication strategy configurations
const config = {
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET
}

// Passport authentication strategy function
const authenticationStrategy = (callbackUrl) => {
	// Add callback url to configurations
	const strategyConfig = {
		...config,
		callbackURL: callbackUrl
	}

	return new Strategy(strategyConfig, (accessToken, refreshToken, profile, done) => {
		return done(null, profile)
	})
}

// Export authentication strategy function
export default authenticationStrategy
