const path = require("path");

module.exports = {
  entry: "./src/browser.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "browser.js"
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8080
  }
};

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
