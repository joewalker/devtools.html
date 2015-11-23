var path = require("path");

module.exports = {
  resolve: {
    alias: {
      devtools: path.join(__dirname, "..")
    },
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
