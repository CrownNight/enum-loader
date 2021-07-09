const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/test/index.enum.ts",
  resolve: {
    extensions: [".ts"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "test.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node-modules/,
      },
      {
        test: /\.enum.ts/,
        use: [
          {
            loader: "./src/index.ts",
          },
        ],
        exclude: /node-modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "index",
    }),
    new CleanWebpackPlugin(),
  ],
};
