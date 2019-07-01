/**
 * Autor: Andre Sieverding
 * Copyright © 2019
 */

// Allow Node.js to require and load `.marko` files
require("marko/node-require")

// Include required packages
var express = require("express")
var markoExpress = require("marko/express")
var lasso = require("lasso")
var fs = require("fs")
var template = require("./template")

// Read App configurations
var config = fs.readFileSync('config.json')
config = JSON.parse(config)

// Read routes
var routes = fs.readFileSync('routes.json')
routes = JSON.parse(routes)

// Create Express App
var app = express()

// Grant access for static files
// Satic files: assets/ directory
app.use(config.path + '/assets', express.static('assets'), (req, res, next) => {
	next()
})

// Enable res.marko(template, data)
app.use(markoExpress())

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
lasso.configure({
	plugins: [
		'lasso-marko',
		// 'lasso-sass'
	],
	outputDir: __dirname + '/static',
    urlPrefix: config.path + '/static',
	bundlingEnabled: true,
	minify: true
})

app.use(require('lasso/middleware').serveStatic())

// Include Routes / Views
routes.forEach(route => {
    app.get(config.path + route.route, (req, res) => {
    	res.marko(template, {
            $global: {
                title: route.title,
                view: "view/" + route.view,
                route: route.route,
                path: config.path,
                params: req.params,
                serializedGlobals: {
                    view: true,
                    title: true,
                    route: true,
                    path: true,
                    params: true
                }
            }
    	})
    })
})

var port = process.env.PORT || config.port

app.listen(port)

console.log(`Server is listening on port ${port}!`)
