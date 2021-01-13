const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpackConfigCommon = require("./webpack.config.common");

module.exports = merge(webpackConfigCommon, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    port: 4200,
  },
  output: {
    filename: "[name].bundle.js",
  },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.(s?css)$/,
  //         use: [
  //           {
  //             loader: "style-loader",
  //           },
  //           {
  //             loader: "css-loader",
  //           },
  //           {
  //             loader: "postcss-loader",
  //             options: {
  //               plugins: function () {
  //                 return [require("precss"), require("autoprefixer")];
  //               },
  //             },
  //           },
  //           {
  //             loader: "sass-loader",
  //           },
  //         ],
  //         exclude: /node_modules/,
  //       },
  //       {
  //         test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$/,
  //         use: [
  //           {
  //             loader: "file-loader",
  //             options: {
  //               name: "[path][name].[ext]",
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
  ],
});
