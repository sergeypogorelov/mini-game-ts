/* eslint-disable-next-line */
const path = require('path');
/* eslint-disable-next-line */
const { merge } = require('webpack-merge');

/* eslint-disable-next-line */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* eslint-disable-next-line */
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
/* eslint-disable-next-line */
const TerserPlugin = require('terser-webpack-plugin');
/* eslint-disable-next-line */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* eslint-disable-next-line */
const webpackConfigCommon = require('./webpack.config.common');

module.exports = merge(webpackConfigCommon, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[fullhash].js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsWebpackPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|m4a|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
              outputPath: (url) => url.replace('src/', ''),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
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
});
