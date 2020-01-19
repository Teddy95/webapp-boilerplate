module.exports = [
	{
		route: '/',
		title: 'Hello World!',
		authentication: false,
		view: 'start'
	},
	{
		route: '/test',
		title: 'Hello World!',
		authentication: false,
		function: require('./scripts/test.js')
	}
]
