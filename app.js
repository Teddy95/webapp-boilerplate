// Parse environment variables from .env
import 'dotenv/config'

// Import required modules
import os from 'os'
import express from 'express'
import compressionMiddleware from 'compression'
import markoMiddleware from '@marko/express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import formData from 'express-form-data'
import cookieParser from 'cookie-parser'
import config from './config.js'

const port = process.env.PORT || config.port

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

	// Load app
	if (isDev) {
		const { createServer } = await import('vite')
		const devServer = await createServer({
			appType: 'custom',
			server: { middlewareMode: true }
		})

		app.use(devServer.middlewares)
		app.use(async (req, res, next) => {
			try {
				const { router } = await devServer.ssrLoadModule('./app/router.js')
				router(req, res, handleNext)
			} catch (err) {
				handleNext(err)
			}

			function handleNext (err) {
				if (err) devServer.ssrFixStacktrace(err)
				next(err)
			}
		})
	} else {
		// Load compiled production app build
		app.use('/assets', express.static('dist/assets'))
		app.use((await import('./dist/router.js')).router)
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
