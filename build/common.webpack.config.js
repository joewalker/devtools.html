/* eslint-env node */

"use strict";

var path = require("path");

module.exports = {
  resolve: {
    alias: {
      devtools: path.join(__dirname, ".."),
      // Hardcode en-US for now
      l10n: path.join(__dirname, "..", "client", "locales", "en-US"),
      sdk: path.join(__dirname, "..", "sdk"),
      acorn: path.join(__dirname, "..", "shared", "acorn"),
    },
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.properties$/, loader: "properties-loader" },
      { test: /\.json$/, loader: "json-loader" },
    ]
  }
};
