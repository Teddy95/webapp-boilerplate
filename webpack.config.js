/**
* Autor: Andre Sieverding
* Copyright © 2019
*/

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPreBuildPlugin = require('pre-build-webpack')
const { getUserAgentRegExp } = require('browserslist-useragent-regexp')
const config = require('./config')

// Get node environment
const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'
const env = isDev ? 'development' : 'production'

// Define pre-build function
const preBuild = () => {
    // Build user agent regexp file for outdatedBrowser.js script
    var fileContent = 'module.exports = ' + getUserAgentRegExp({
        browsers: fs.readFileSync(path.resolve(__dirname, '.browserslistrc')).toString().replace('\r', '').split('\n').filter(Boolean).join(' and '),
        allowHigherVersions: true
    })
    var file = path.resolve(__dirname, 'dist', 'supportedBrowsers.js')

    if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
        fs.mkdirSync(path.resolve(__dirname, 'dist'))
    }

    fs.writeFile(file, fileContent, (err) => {
        if (err) {
            throw err
        }
    })
}

// Define webpack rules
const markoRule = {
    test: /\.marko?$/,
    loader: '@marko/webpack/loader'
}

const styleRule = {
    test: /\.(sass|scss|css)$/,
    use: isDev ? [
        'css-hot-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
    ] : [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
    ]
}

const vectorRule = {
    test: /\.svg/,
    loader: 'svg-url-loader'
}

const imageRule = {
    test: /\.(jpg|jpeg|gif|png|ico)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: 'images/[name]-[hash:8].[ext]'
            }
        }
    ]
}

const mediaRule = {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: 'media/[name]-[hash:8].[ext]'
            }
        }
    ]
}

const fontRule = {
    test: /\.(woff|woff2|ttf|eot)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: 'webfonts/[name]-[hash:8].[ext]'
            }
        }
    ]
}

// Webpack config for browser
const client = {
    name: 'Client',
    mode: env,
    entry: {
        app: isDev ? [
            'webpack-hot-middleware/client?reload=true',
            './app/client.js'
        ] : ['./app/client.js'],
        outdatedBrowser: ['./app/scripts/outdatedBrowser.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: config.path + '/assets/'
    },
    devServer: isDev ? {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
        overlay: true,
        hot: true,
        stats: 'minimal',
    } : undefined,
    devtool: isDev ? 'source-map' : undefined,
    resolve: {
        extensions: ['.js', '.json', '.marko']
    },
    module: {
        rules: [markoRule, styleRule, vectorRule, imageRule, mediaRule, fontRule]
    },
    plugins: [
        new WebpackPreBuildPlugin(() => {
            preBuild()
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        isDev && new webpack.HotModuleReplacementPlugin()
    ].filter(Boolean)
}

// Webpack config for server
const server = {
    name: 'Server',
    mode: env,
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    externals: nodeExternals(),
    entry: {
        server: ['./app/server.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json', '.marko']
    },
    module: {
        rules: [markoRule, vectorRule, imageRule]
    }
}

module.exports = [
    server,
    client
]
