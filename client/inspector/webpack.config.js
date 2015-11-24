var common = require("../../build/common.webpack.config");

module.exports = Object.assign({}, common, {
  context: __dirname,
  entry: "./inspector-panel.js",
  output: {
    path: __dirname,
    filename: "build.js"
  },
});
