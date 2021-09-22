/* eslint-disable-next-line */
const path = require('path');

/* eslint-disable-next-line */
const { merge } = require('webpack-merge');

module.exports = merge(
  {},
  {
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    entry: {
      main: path.resolve(__dirname, '../src/index.ts'),
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
);
