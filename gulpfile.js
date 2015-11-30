/* eslint-env node */
"use strict";

// Lets us use babel in tests
require("babel-core/register");

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var mocha = require("gulp-mocha");
var wsTcpProxy = require("./tools/ws-tcp-proxy");
var http = require("http");
var ecstatic = require("ecstatic");

var WEBPACK_CONFIG_NAME = "webpack.config.js";
var PREFS_SRC_FILE = path.join(__dirname, "client", "preferences", "devtools.js");
var PREFS_OUTPUT_FILE = path.join(__dirname, "build", "preferences.json");
var CONNECT_HTTP_PORT = 8081;

/**
 * Builds a webpack dir via `dirPath`, mapping to
 * `${dirPath}/webpack.config.js`, resolving the returned promise on completion.
 *
 * @param {String} toolName
 * @return {Promise}
 */
function buildDir(dirPath) {
  var toolConfig = path.join(dirPath, WEBPACK_CONFIG_NAME);

  return new Promise(function (resolve, reject) {
    // If tool directory doesn"t have a webpack build config,
    // skip it
    try {
      if (!fs.statSync(toolConfig).size) {
        console.log("Skipping dir", dirPath);
        resolve();
        return;
      }
    } catch(e) {
      console.log("Skipping dir", dirPath);
      resolve();
      return;
    }

    webpack(require(toolConfig), function (err, stats) {
      if (err) {
        reject(new gutil.PluginError("webpack", err));
      }
      gutil.log("[webpack] Path: " + dirPath, stats.toString({}));
      resolve();
    });
  });
}

gulp.task("build", function () {
  var tools = fs.readdirSync(path.join(__dirname, "client"));
  /*var dirs = tools.map(function(tool) {
    return path.join(__dirname, "client", tool);
  });*/
  var dirs = [];
  dirs.push(path.join(__dirname, "client", "inspector", "content"));
  dirs.push(path.join(__dirname, "client", "inspector"));
  dirs.push(path.join(__dirname, "client", "styleinspector"));
  dirs.push(path.join(__dirname, "client", "fontinspector"));
  dirs.push(path.join(__dirname, "client", "framework", "content"));
  dirs.push(path.join(__dirname, "client", "framework"));
  dirs.push(path.join(__dirname, "tools", "connect"));
  return Promise.all(dirs.map(buildDir));
});

gulp.task("build-console", function () {
  var tools = fs.readdirSync(path.join(__dirname, "client"));
  var dirs = [];
  dirs.push(path.join(__dirname, "client", "console"));
  dirs.push(path.join(__dirname, "client", "framework"));
  return Promise.all(dirs.map(buildDir));
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

gulp.task("watch-console", function() {
  var watcher = gulp.watch(["client/webconsole/*"]);
  watcher.on("change", function(event) {
    console.log("File " + event.path + " was " + event.type);
    if (event.type == "changed" &&
        event.path.indexOf("build.js") == -1) {
      console.log("Running build");
      gulp.run("build-console");
    }
  });
});

/**
 * Crudely parses `client/preferences/devtools.js` and generates
 * a JSON representation of these prefs in `build/prefs.json`
 * For preprocessing directives, it"ll just use the last form called in the file.
 */
gulp.task("build-prefs", function (callback) {
  var lines = fs.readFileSync(PREFS_SRC_FILE, "utf8").split("\n");
  fs.writeFile(PREFS_OUTPUT_FILE, JSON.stringify(lines.reduce(function (prefs, line) {
    line = line.trim();
    if (!line || line[0] === "#" || line[0] === "/") {
      return prefs;
    }

    var prefNames = /^\s*pref\(['"]([\w\.]*)['"],\s(.*)\);/.exec(line);
    if (!prefNames) {
      return prefs;
    }

    var currentBranch = prefs;
    var prefName = prefNames[1];
    console.log(prefName, prefNames[2]);
    var value = eval(prefNames[2]);

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

gulp.task("build-test", function (callback) {
  var webpackConfig = path.join(__dirname, "test", WEBPACK_CONFIG_NAME);
  webpack(require(webpackConfig), function (err, stats) {
    gutil.log("[webpack]", stats.toString({}));
    callback();
  });
});

gulp.task("start-proxy", function() {
  // WS <-> TCP server in Firefox
  wsTcpProxy.listen({
    wsPort: 9000,
    tcpPort: 6080
  });
  // WS <-> TCP server in Valence add-on <-> Chrome
  wsTcpProxy.listen({
    wsPort: 9001,
    tcpPort: 6081
  });
});

gulp.task("build-connect", function() {
  return buildDir(path.join(__dirname, "tools", "connect"));
});

gulp.task("serve-connect", ["build-connect", "start-proxy"], function() {
  var server = http.createServer(ecstatic({
    root: path.join(__dirname, "tools", "connect"),
    cache: 0
  }));
  server.listen(CONNECT_HTTP_PORT);
  console.log("Open http://localhost:8081/?wsPort=9000 to test Firefox");
  console.log("Open http://localhost:8081/?wsPort=9001 to test Chrome");
});

gulp.task("start", ["start-proxy"], function() {
  var server = http.createServer(ecstatic({
    root: path.join(__dirname),
    cache: 0
  }));

  server.listen(8055);

  console.log("Open http://localhost:8055/client/framework/toolbox-wrapper.html");
});

/**
 * Build client/framework directory (mostly related to the Toolbox)
 */
gulp.task("build-framework", function() {
  var dirs = [];
  dirs.push(path.join(__dirname, "client", "framework"));
  dirs.push(path.join(__dirname, "client", "framework", "content"));
  return Promise.all(dirs.map(buildDir));
});

/**
 * Watch client/framework/content directory
 */
gulp.task("watch-framework", function() {
  var watcher = gulp.watch(["client/framework/**/*"]);
  watcher.on("change", function(event) {
    if (event.type == "changed" && event.path.indexOf("build.js") == -1) {
      gulp.run("build-framework");
    }
  });
});

/**
 * Build client/inspector directory
 */
gulp.task("build-inspector", function() {
  var dirs = [];
  dirs.push(path.join(__dirname, "client", "inspector"));
  dirs.push(path.join(__dirname, "client", "inspector", "content"));
  return Promise.all(dirs.map(buildDir));
});

/**
 * Watch client/framework/content directory
 */
gulp.task("watch-inspector", function() {
  var watcher = gulp.watch(["client/inspector/**/*", "client/framework/content/**/*"]);
  watcher.on("change", function(event) {
    if (event.type == "changed" && event.path.indexOf("build.js") == -1) {
      gulp.run("build-inspector");
    }
  });
});

gulp.task("default", ["build"]);
