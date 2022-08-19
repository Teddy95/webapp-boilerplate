// Import required modules
import path from 'path'
import passport from 'passport'
import authMethods from '../authentication'

// Get configurations
import config from '../../config'

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

export { passport, checkAuthentication, logout, callbackUrl }
