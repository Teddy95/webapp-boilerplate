import startView from './view/start.marko'
import testFunction from './scripts/test.js'

export default [
	// Route from marko view template
	{
		route: '/',
		title: 'Start',
		authentication: false,
		view: startView
	},
	// Route from js function
	{
		route: '/test',
		title: 'Hello World!',
		authentication: false,
		function: testFunction
	}
]
