// Import strategy
const GitHubStrategy = require('passport-github').Strategy

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

	return new GitHubStrategy(strategyConfig, (accessToken, refreshToken, profile, done) => {
		return done(null, profile)
	})
}

// Export authentication strategy function
module.exports = authenticationStrategy
