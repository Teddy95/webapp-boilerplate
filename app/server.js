/**
 * Autor: Andre Sieverding
 * Copyright © 2019
 */

// Include required packages
import express from 'express'

// Read App configurations
import config from '../config.json'

// Read App routes
import routes from './routes.json'

// Get template
import template from './template.marko'

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

// Grant access for static files
app.use(config.path + '/assets', express.static('dist'), (req, res, next) => {
	next()
})

// Include Routes / Views
routes.forEach(route => {
    app.get(config.path + route.route, async (req, res) => {
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
})

var port = process.env.PORT || config.port

app.listen(port)

console.log(`Server is listening on port ${port}!`)
console.log('Press Ctrl+C to quit.')
