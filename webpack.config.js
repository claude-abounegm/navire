const path = require("path");
const buildPath = path.resolve(__dirname, "dist");

module.exports = {
  entry: "./src/browser.js",
  mode: "production",
  output: {
    path: buildPath,
    publicPath: "/",
    filename: "navire-browser.js"
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  devServer: {
    contentBase: buildPath,
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
