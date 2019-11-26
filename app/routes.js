module.exports = [
	{
		route: '/',
		title: 'Hello World!',
		view: 'start'
	},
	{
		route: '/test',
		title: 'Hello World!',
		function: require('./scripts/test.js')
	}
]
