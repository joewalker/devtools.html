var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WEBPACK_CONFIG_NAME = "webpack.config.js";

/**
 * Builds a tool's webpack via `toolName`, mapping
 * to `client/${toolName}/webpack.config.js`, resolving
 * the returned promise on completion.
 *
 * @param {String} toolName
 * @return {Promise}
 */
function buildTool (toolName) {
  var toolConfig = path.join(__dirname, "client", toolName, WEBPACK_CONFIG_NAME);

  return new Promise(function (resolve, reject) {
    // If tool directory doesn't have a webpack build config,
    // skip it
    if (!fs.statSync(toolConfig).size) {
      resolve();
    }

    webpack(require(toolConfig), function (err, stats) {
      if (err) {
        reject(new gutil.PluginError("webpack", err));
      }
      gutil.log("[webpack]", stats.toString({}));
      resolve();
    });
  });
}

gulp.task("build", function (callback) {
  var tools = fs.readdirSync(path.join(__dirname, "client"));
  Promise.all(tools.map(buildTool)).then(callback);
});

gulp.task("default", ["build"]);
