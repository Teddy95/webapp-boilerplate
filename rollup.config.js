import commonjsPlugin from 'rollup-plugin-commonjs'
import browserifyPlugin from 'rollup-plugin-browserify-transform'
import nodeResolvePlugin from 'rollup-plugin-node-resolve'
import markoify from 'markoify'
import envify from 'envify'
import path from 'path'

export default {
    input: path.join(__dirname, 'client.js'),
    plugins: [
        browserifyPlugin(markoify),
        browserifyPlugin(envify),
        nodeResolvePlugin({
            jsnext: true,
            main: true,
            browser: true,
            preferBuiltins: false,
            extensions: [ '.js', '.marko' ]
        }),
        commonjsPlugin({
            include: [ 'node_modules/**', './*.marko', '**/*.marko', '**/*.js'],
            extensions: [ '.js', '.marko' ]
        })
    ],
    output: {
		name: 'app',
		file: path.join(__dirname, 'assets/js/bundle.js'),
		format: 'iife'
	}
}
