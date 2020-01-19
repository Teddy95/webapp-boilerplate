// Import strategy
const GitHubStrategy = require('passport-github').Strategy

// Passport authentication strategy configurations
const config = {
	clientID: 'GITHUB_CLIENT_ID',
	clientSecret: 'GITHUB_CLIENT_SECRET'
}

// Passport authentication strategy function
const authenticationStrategy = (callbackUrl) => {
	// Add callback url to configurations
	const strategyConfig = {
		...config,
		callbackURL: callbackUrl,
		// redirectURL: callbackUrl,
		passReqToCallback: true
	}

	return new GitHubStrategy(strategyConfig, (req, accessToken, refreshToken, profile, cb) => {
		return cb(null, profile)
	})
}

// Export authentication strategy function
module.exports = authenticationStrategy
