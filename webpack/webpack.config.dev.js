/* eslint-disable-next-line */
const path = require('path');
/* eslint-disable-next-line */
const { merge } = require('webpack-merge');

/* eslint-disable-next-line */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* eslint-disable-next-line */
const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(webpackConfigCommon, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 4200,
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|m4a|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: (url) => url.replace('src/', ''),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
  ],
});
