/**
 * Autor: Andre Sieverding
 * Copyright © 2020
 */

// Import required modules
const passport = require('passport')
const authenticationStrategy = require('../authentication')

// Get configurations
const config = require('../../config')

// Get node environment
const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

// Build callback url
const callbackUrl = (isDev === true ? `http://localhost${config.path}:${config.port}` : `${config.serverUrl}${config.path}`) + '/auth/callback'

// Use authentication strategy
if (config.authentication === true) {
	passport.use(authenticationStrategy(callbackUrl))

    // Passport serialize & deserialize user methods
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}

// Check authentication function
const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) next()

    // res.redirect('/auth/login')
    next()
}

module.exports = {
	passport: passport,
    checkAuthentication: checkAuthentication,
	callbackUrl: callbackUrl
}
