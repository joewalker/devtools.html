var common = require("../../../build/common.webpack.config");

module.exports = Object.assign({}, common, {
  context: __dirname,
  entry: ["./main.js"],
  output: {
    path: __dirname,
    filename: "build.js",
  },
  externals: {
    // don't bundle the "react" npm package with our bundle.js
    // but get it from a global "React" variable
    "react": "React",
    "react-dom": "ReactDOM",
    "redux": "Redux",
    "react-redux": "ReactRedux"
  },
});
