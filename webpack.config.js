/* eslint-env node */

"use strict";

var path = require("path");

module.exports = {
  entry: {
    fontinspector: [ path.join(__dirname, "client", "fontinspector", "font-inspector.js") ],
    toolbox: [ path.join(__dirname, "client", "framework", "index.js") ],
    inspector: [ path.join(__dirname, "client", "inspector", "inspector-panel.js") ],
    styleinspector: [ path.join(__dirname, "client", "styleinspector", "style-inspector.js") ],
    test: [ "mocha!./test/index.js" ],
  },
  output: {
    path: path.join(__dirname, "built"),
    filename: "[name].js",
    sourceMapFilename: '[file].map',
  },
  resolve: {
    alias: {
      devtools: path.join(__dirname),
      // Hardcode en-US for now
      l10n: path.join(__dirname, "client", "locales", "en-US"),
      sdk: path.join(__dirname, "sdk"),
      acorn: path.join(__dirname, "shared", "acorn"),
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
