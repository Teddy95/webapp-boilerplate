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
app.use('/assets', express.static('assets'), (req, res, next) => {
	next()
})

// Enable res.marko(template, data)
app.use(markoExpress())

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
lasso.configure({
	plugins: [
		'lasso-marko',
		'lasso-sass'
	],
	outputDir: __dirname + '/static',
	bundlingEnabled: true,
	minify: true
})

app.use(require('lasso/middleware').serveStatic())

// Include Routes / Views
routes.forEach(route => {
    app.get(route.route, function(req, res) {
    	res.marko(template, {
            title: route.title,
            view: "view/" + route.view,
            $global: {
                serializedGlobals: {
                    data: true
                }
            }
    	})
    })
})

app.listen(config.port)

console.log(`Server is listening on port ${config.port}!`)
