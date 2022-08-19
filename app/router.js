// Include required packages
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Router } from 'express'
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

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create router
const router = Router()

// Apply router middleware
router.use((req, res, next) => I18n.expressMiddleware(req, res, next))

// Add passport authentication
if (config.authentication) {
    router.use(passport.initialize())
    router.use(passport.session())
    
    for (var authType in authMethods) {
        router.get(`${config.path}/auth/${authType}/login`, passport.authenticate(authType))
        router[authMethods[authType].callbackHttpMethod](`${config.path}/auth/${authType}/callback`, passport.authenticate(authType, config.passport), (req, res) => {
            // res.redirect('/')
        })
    }

    router.get('${config.path}/logout', logout)
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
            res.setHeader("Content-Type", "text/html; charset=utf-8")
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
    router.get(...routeParameters)
}

export { router }
