// Parse environment variables from .env
import 'dotenv/config'

// Import required modules
import fs from 'fs'
import path from 'path'
import os from 'os'
import express from 'express'
import compressionMiddleware from 'compression'
import markoMiddleware from '@marko/express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import formData from 'express-form-data'
import cookieParser from 'cookie-parser'
import { getUserAgentRegExp } from 'browserslist-useragent-regexp'
import { passport, checkAuthentication, logout } from './lib/passport'
import I18n from './scripts/i18n'

// Read app configurations
import config from '../config'

// Read app routes
import routes from './routes'

// Get authentication methods
import authMethods from './authentication'

// Get app skeleton
import template from './template.marko'

const port = parseInt(process.env.PORT || config.port, 10)

// Get node environment
const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

// Main program
const main = async () => {
	console.time('Start')

	// Create server
	const app = express()

    // Define formData configurations
    const options = {
    	uploadDir: os.tmpdir(),
    	autoClean: false
    }

    // Apply server middleware
    app.use(compressionMiddleware())
    app.use(expressSession({ secret: config.name, resave: true, saveUninitialized: false }))
    app.use(bodyParser.urlencoded({ extended : true }))
    app.use(bodyParser.json())
    app.use(formData.parse(options))
    app.use(cookieParser())
    app.use(markoMiddleware())
	app.use((req, res, next) => I18n.expressMiddleware(req, res, next))

	// Add passport authentication
	if (config.authentication) {
		app.use(passport.initialize())
		app.use(passport.session())

		for (var authType in authMethods) {
			app.get(`${config.path}/auth/${authType}/login`, passport.authenticate(authType))
			app[authMethods[authType].callbackHttpMethod](`${config.path}/auth/${authType}/callback`, passport.authenticate(authType, config.passport), (req, res) => {
				// res.redirect('/')
			})
		}

		app.get(`${config.path}/logout`, logout)
	}

	// Include Routes / Views
	for (const route of routes) {
		// Create route parameters array & push the route to it
		var routeParameters = []
		routeParameters.push(config.path + route.route)

		// Check if authentication is required for this endpoint
		if (config.authentication && route.authentication) {
			// Push authentication middleware to route parameters array
			routeParameters.push(checkAuthentication)
		}

		// Push view or function to route parameters array
		if (typeof route.view !== 'undefined') {
			routeParameters.push(async (req, res) => {
				// Determine if browser is outdated
				const supportedBrowsers = getUserAgentRegExp({
					browsers: fs.readFileSync(path.resolve(__dirname, '..', '.browserslistrc')).toString().replace(/[\r]/g, '').split('\n').map((x) => x != '' ? x : false).filter(Boolean),
					allowHigherVersions: true
				})

				// Set server response to client
				res.setHeader('Content-Type', 'text/html; charset=utf-8')
				res.marko(template, {
					$global: {
						view: route.view,
						route: route.route,
						title: res.__(route.title),
						path: config.path,
						params: req.params,
						query: req.query,
						user: req.user,
						outdatedBrowser: !supportedBrowsers.test(req.headers['user-agent']),
						serializedGlobals: {
							view: true,
							route: true,
							title: true,
							path: true,
							params: true,
							query: true,
							user: true,
							outdatedBrowser: true
						}
					}
				}, res)
			})
		} else {
			routeParameters.push(route.function)
		}

		// Define route
		app.get(...routeParameters)
	}

	// Start server
	app.listen(port, (err) => {
		if (err) {
			throw err
		}

		console.timeEnd('Start')
		console.log(`Env: ${NODE_ENV}`)
		console.log(`Server is listening on port ${port}!`)
		console.log('Press Ctrl+C to quit.')
	})
}

// Start web app
main()
