var path = require('path')

module.exports = {
	entry: './client.js',
	output: {
		path: path.join(__dirname, 'assets', 'js'),
		publicPath: path.join(__dirname, 'assets', 'js'),
		filename: 'bundle.min.js'
	},
	resolve: {
		extensions: ['.js', '.marko']
	},
	module: {
		rules: [
			{
				test: /\.marko$/,
				use: 'marko-loader'
			},
			{
				test: /\.(sass|scss|css)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	}
}
