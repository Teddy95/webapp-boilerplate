/**
 * Autor: Andre Sieverding
 * Copyright © 2020
 */

// Include required packages
import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'

// Get App configurations
import config from '../config'

// Get authentication methods
import authMethods from './authentication'

// Get App routes
import routes from './routes'

// Get template
import template from './template.marko'

// Import authentication functions if it is enabled
if (config.authentication) {
    var { passport, checkAuthentication, logout } = require('./lib/passport')
}

// Create Express App
var app = express()

// Get node environment
const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

// Include webpack middleware for development
if (isDev) {
    var webpackConfig = require('../webpack.config.js')[1]
    var webpack = require('webpack')
    var webpackDevMiddleware = require('webpack-dev-middleware')
    var webpackHotMiddleware = require('webpack-hot-middleware')

    // Remove first plugin from webpack config -> pre-build plugin
    webpackConfig.plugins.shift()

    var compiler = webpack(webpackConfig)

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: 'minimal'
    }))

    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }))
}

// Apply server middleware
app.use(expressSession({ secret: config.name, resave: true, saveUninitialized: false }))
app.use(bodyParser.urlencoded({ extended : true }))

if (config.authentication) {
    app.use(passport.initialize())
    app.use(passport.session())
}

// Grant access for static files
app.use(config.path + '/assets', express.static('dist'), (req, res, next) => {
    next()
})

// Add passport authentication routes
if (config.authentication) {
    for (var authType in authMethods) {
        app.get(`/auth/${authType}/login`, passport.authenticate(authType))
        app[authMethods[authType].callbackHttpMethod](`/auth/${authType}/callback`, passport.authenticate(authType, config.passport), (req, res) => {
            // res.redirect('/')
        })
    }

    app.get('/logout', logout)
}

// Include Routes / Views
routes.forEach(route => {
    // Create route parameters array & push the route to it
    var routeParameters = []
    routeParameters.push(config.path + route.route)

    // Check if authentication is required for this route
    if (config.authentication && route.authentication) {
        // Push authentication middleware to route parameters array
        routeParameters.push(checkAuthentication)
    }

    // Push view or function to route parameters array
    if (typeof route.view !== 'undefined') {
        routeParameters.push(async (req, res) => {
            res.setHeader("Content-Type", "text/html; charset=utf-8")
            template.render({
                $global: {
                    title: route.title,
                    view: route.view,
                    route: route.route,
                    path: config.path,
                    params: req.params,
                    query: req.query,
                    serializedGlobals: {
                        view: true,
                        title: true,
                        route: true,
                        path: true,
                        params: true,
                        query: true
                    }
                }
            }, res)
        })
    } else {
        routeParameters.push(route.function)
    }

    // Define route
    app.get(...routeParameters)
})

var port = process.env.PORT || config.port

app.listen(port)

console.log(`Server is listening on port ${port}!`)
console.log('Press Ctrl+C to quit.')
