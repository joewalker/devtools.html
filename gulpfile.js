var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WEBPACK_CONFIG_NAME = "webpack.config.js";
var PREFS_SRC_FILE = path.join(__dirname, "client", "preferences", "devtools.js");
var PREFS_OUTPUT_FILE = path.join(__dirname, "build", "preferences.json");

/**
 * Builds a tool"s webpack via `toolName`, mapping
 * to `client/${toolName}/webpack.config.js`, resolving
 * the returned promise on completion.
 *
 * @param {String} toolName
 * @return {Promise}
 */
function buildTool (toolName) {
  var toolConfig = path.join(__dirname, "client", toolName, WEBPACK_CONFIG_NAME);

  return new Promise(function (resolve, reject) {
    // If tool directory doesn"t have a webpack build config,
    // skip it
    try {
      if (!fs.statSync(toolConfig).size) {
        resolve();
        return;
      }
    } catch(e) {
      resolve();
      return;
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

gulp.task("build", function () {
  var tools = fs.readdirSync(path.join(__dirname, "client"));
  return Promise.all(tools.map(buildTool));
});

gulp.task("watch", function() {
  var watcher = gulp.watch(["client/**/*","shared/**/*","sham/**/*"]);
  watcher.on("change", function(event) {
    console.log("File " + event.path + " was " + event.type);
    if (event.type == "changed" &&
        event.path.indexOf("build.js") == -1) {
      console.log("Running build");
      gulp.run("build");
    }
  });
});

/**
 * Crudely parses `client/preferences/devtools.js` and generates
 * a JSON representation of these prefs in `build/prefs.json`
 * For preprocessing directives, it'll just use the last form called in the file.
 */
gulp.task("build-prefs", function (callback) {
  var lines = fs.readFileSync(PREFS_SRC_FILE, "utf8").split("\n");
  fs.writeFile(PREFS_OUTPUT_FILE, JSON.stringify(lines.reduce(function (prefs, line) {
    line = line.trim();
    if (!line || line[0] === "#" || line[0] === "/") {
      return prefs;
    }

    var prefNames = /^pref\(["'](.*)["'],\s(.*)\)/.exec(line);
    if (!prefNames) {
      return prefs;
    }

    var currentBranch = prefs;
    var prefName = prefNames[1];
    var value = prefNames[2];
    for (var branch of prefName.split(".")) { 
      currentBranch = (currentBranch[branch] = currentBranch[branch] || Object.create(null));
    }
    currentBranch.value = value;
    // Use enums from
    // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIPrefBranch#Constants
    currentBranch.type = typeof value === "boolean" ? 128 :
                         typeof value === "string" ? 32 :
                         typeof value === "number" ? 64 : 0;
    return prefs;
  }, Object.create(null)), null, 2), callback);
});

gulp.task("default", ["build"]);
