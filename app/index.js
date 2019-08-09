/**
 * Autor: Andre Sieverding
 * Copyright © 2019
 */

// Import required packages
import express from 'express'
import fs from 'fs'
import template from './template.marko'

// Read App configurations
var config = fs.readFileSync('config.json')
config = JSON.parse(config)

// Read routes
var routes = fs.readFileSync('routes.json')
routes = JSON.parse(routes)

// Create Express App
var app = express()
var port = process.env.PORT || config.port

// Enable gzip compression for all HTTP responses
import compression from "compression"
app.use(compression())

// Grant access for static files
import serveStatic from "serve-static"
app.use("/static", serveStatic("dist/client"))

// Include Routes / Views
routes.forEach(route => {
    app.get(config.path + route.route, (req, res) => {
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        template.render({
            $global: {
                title: route.title,
                view: route.view,
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
        }, res)
    })
})

// Start the server
app.listen(port, err => {
    if (err) {
        throw err
    }

    if (port !== '0') {
        console.log(`Server is listening on port ${port}!`)
    }
})
