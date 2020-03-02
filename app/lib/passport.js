// Import required modules
const path = require('path')
const passport = require('passport')
const authMethods = require('../authentication')

// Get configurations
const config = require('../../config')

// Get node environment
const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

// Use authentication strategy
if (config.authentication === true) {
	for (var authType in authMethods) {
		// Build callback url
		var callbackUrl = (isDev === true ? `http://localhost${config.path}:${config.port}` : `${config.serverUrl}${config.path}`) + `/auth/${authType}/callback`
		passport.use(authMethods[authType].authMehtodFile(callbackUrl))
	}

	// Passport serialize user
	passport.serializeUser((user, done) => {
		done(null, user)
	})

    // Passport deserialize user
    passport.deserializeUser((user, done) => {
		done(null, user)
	})
}

// Check authentication function
const checkAuthentication = (req, res, next) => {
	if (req.isAuthenticated()) return next()
	res.send('Unauthenticated')
}

// Logout function
const logout = (req, res) => {
    if (!req.isAuthenticated()) res.redirect('/')

    req.logout()
    res.redirect('/')
}

module.exports = {
	passport: passport,
	checkAuthentication: checkAuthentication,
    logout: logout,
	callbackUrl: callbackUrl
}
