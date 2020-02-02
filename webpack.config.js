const path = require("path");

module.exports = {
  //   entry: "./js/app.js",
  //   output: {
  //     path: path.resolve(__dirname, "build"),
  //     filename: "app.bundle.js"
  //   },
  //   module: {
  //     loaders: [
  //       {
  //         test: /\.js$/,
  //         loader: "babel-loader",
  //         query: {
  //           presets: ["es2015"]
  //         }
  //       }
  //     ]
  //   },
  entry: "./src/index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
};
