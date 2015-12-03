/* eslint-env babel-node */
"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var mocha = require("gulp-mocha");
var wsTcpProxy = require("./tools/ws-tcp-proxy");
var http = require("http");
var ecstatic = require("ecstatic");
var express = require("express");
var morgan = require("morgan");
var proxy = require("express-http-proxy");

var WEBPACK_CONFIG_NAME = "webpack.config.js";
var customfs = require("./tools/loader/responses").customfs;

var PREFS_SRC_FILE = path.join(__dirname, "client", "preferences", "devtools.js");
var PREFS_OUTPUT_FILE = path.join(__dirname, "build", "preferences.json");
var CONNECT_HTTP_PORT = 8081;

gulp.task("build", function () {
  console.error('Use `webpack --progress --color`');
});

gulp.task("watch", function() {
  console.error('Use `webpack --progress --color --watch`');
});

gulp.task("build-connect", function() {
  console.error('Use `webpack --progress --color`');
});

gulp.task("build-test", function (callback) {
  console.error('Use `webpack --progress --color`');
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

gulp.task("start-proxy", function() {
  // WS <-> TCP server in Firefox
  wsTcpProxy.listen({
    wsPort: 9000,
    tcpPort: 6080,
  });
  // WS <-> TCP server in Valence add-on <-> Chrome
  wsTcpProxy.listen({
    wsPort: 9001,
    tcpPort: 6081
  });
});

gulp.task("start", ["start-proxy"], function() {
  var app = express();

  app.use('/chrome-tab-list/json', proxy('localhost:9222', {
    forwardPath: function(req, res) {
      return "/json";
    }
  }));

  app.use(morgan('dev'));

  app.use(ecstatic({
    root: path.join(__dirname),
    baseDir: '/',
    handleError: false,
    fs: customfs,
  }));

  http.createServer(app).listen(CONNECT_HTTP_PORT);

  console.log("Open http://localhost:8081/client/framework/toolbox-wrapper.html to test the toolbox");
  console.log("Open http://localhost:8081/tools/connect/?wsPort=9000 for the test tool (for Firefox server)");
  console.log("Open http://localhost:8081/tools/connect/?wsPort=9001 for the test tool (for Chrome server)");
});

gulp.task("default", ["build"]);
