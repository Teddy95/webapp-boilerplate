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
		callbackURL: callbackUrl,
		passReqToCallback: true
	}

	return new GitHubStrategy(strategyConfig, (req, accessToken, refreshToken, profile, cb) => {
		return cb(null, profile)
	})
}

// Export authentication strategy function
module.exports = authenticationStrategy
