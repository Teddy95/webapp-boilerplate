/**
 * Inspired by https://github.com/marko-js-samples/marko-webpack
 */

const path = require("path")
const fs = require("fs")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MarkoPlugin = require("@marko/webpack/plugin").default
const CSSExtractPlugin = require("mini-css-extract-plugin")
const SpawnServerPlugin = require("spawn-server-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")

// Read App configurations
var config = fs.readFileSync('config.json')
config = JSON.parse(config)

const { NODE_ENV } = config.mode
const isProd = NODE_ENV === "production"
const isDev = !isProd
const markoPlugin = new MarkoPlugin()
const spawnedServer = isDev && new SpawnServerPlugin()

module.exports = [
    compiler({
        name: "Client",
        optimization: {
            splitChunks: {
                chunks: "all",
                maxInitialRequests: 3
            }
        },
        output: {
            filename: "[name].[contenthash:8].js",
            path: path.join(__dirname, "dist/client")
        },
        devServer: isDev ? {
            overlay: true,
            stats: "minimal",
            contentBase: false,
            ...spawnedServer.devServerConfig
        }: undefined,
        plugins: [
            new webpack.DefinePlugin({
                "process.browser": true
            }),
            new CSSExtractPlugin({
                filename: "[name].[contenthash:8].css"
            }),
            isProd && new OptimizeCssAssetsPlugin(),
            markoPlugin.browser
        ]
    }),
    compiler({
        name: "Server",
        target: "async-node",
        externals: [/^[^./!]/], // excludes node_modules
        optimization: {
            minimize: false
        },
        entry: './app',
        output: {
            libraryTarget: "commonjs2",
            path: path.join(__dirname, "dist/server")
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.browser": undefined,
                "process.env.BUNDLE": true
            }),
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();',
                raw: true
            }),
            new CSSExtractPlugin({
                filename: "[name].[contenthash:8].css"
            }),
            isDev && spawnedServer,
            markoPlugin.server
        ]
    })
]

// Shared config for both server and client compilers.
function compiler(config) {
    return {
        ...config,
        mode: isProd ? "production" : "development",
        devtool: isProd ? "source-map" : "inline-source-map",
        output: {
            publicPath: "/static/",
            ...config.output
        },
        resolve: {
            extensions: [".js", ".json", ".marko"]
        },
        module: {
            rules: [
                {
                    test: /\.marko$/,
                    loader: "@marko/webpack/loader"
                },
                {
                    test: /\.(sass|scss|css)$/,
                    use: [CSSExtractPlugin.loader, "css-loader", "sass-loader"]
                },
                {
                    test: /\.svg/,
                    loader: "svg-url-loader"
                },
                {
                    test: /\.(jpg|jpeg|gif|png|ico)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "../client/images",
                        publicPath: "/static/images"
                    }
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "../client/webfonts",
                        publicPath: "/static/webfonts"
                    }
                }
            ]
        },
        plugins: [...config.plugins, isProd && new CleanWebpackPlugin()].filter(Boolean)
    }
}
