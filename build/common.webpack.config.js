var path = require("path");

module.exports = {
  resolve: {
    alias: {
      devtools: path.join(__dirname, ".."),
      // Hardcode en-US for now
      l10n: path.join(__dirname, "../client/locales/en-US")
    },
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.properties$/, loader: "properties-loader" },
    ]
  }
};
