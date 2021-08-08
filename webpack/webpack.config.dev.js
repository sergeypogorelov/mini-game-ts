const path = require('path');
const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(
    webpackConfigCommon,
    {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.resolve(__dirname, '../dist'),
            port: 4200,
        },
        output: {
            filename: '[name].bundle.js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
            }),
        ],
    }
);
