var common = require("../build/common.webpack.config");

module.exports = Object.assign({}, common, {
  entry: "mocha!./index.js",
  context: __dirname,
  output: {
    filename: "test.build.js",
    path: __dirname,
  },
});
