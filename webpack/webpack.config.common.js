const path = require("path");
const { merge } = require("webpack-merge");

module.exports = merge(
  {},
  {
    entry: {
      main: path.resolve(__dirname, "../src/index.ts"),
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts"],
    },
  }
);
