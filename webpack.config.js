const path = require("path");
const buildPath = path.resolve(__dirname, "browser", "dist");

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
    contentBase: [path.resolve(__dirname, "browser", "example"), buildPath],
    compress: true,
    port: 8080
  },
  hot: true
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
