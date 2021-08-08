const path = require('path');
const { merge } = require('webpack-merge');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(
    webpackConfigCommon,
    {
        mode: 'production',
        devtool: 'source-map',
        output: {
            filename: '[name].[fullhash].js',
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            }),
        ],
    }
);
