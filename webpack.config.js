module.exports = {
	// mode: 'development',
	mode: 'production',
	entry: './client.js',
	output: {
		path: __dirname,
		filename: 'assets/js/bundle.js',
		// filename: 'assets/js/bundle.min.js'
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
