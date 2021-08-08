const path = require('path');
const { merge } = require('webpack-merge');

module.exports = merge(
    {},
    {
        target: ['web', 'es5'],
        resolve: {
            extensions: ['.js'],
        },
        entry: {
            main: path.resolve(__dirname, '../src/index.js'),
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
        },
    }
);
