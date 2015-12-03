
"use strict";

var fs = require("fs");
var cssnext = require("cssnext");

var Readable = require("stream").Readable;

/**
 * This is the filtering filesystem that we export to ecstatic
 */
var customfs = exports.customfs = {
  stat(file, callback) {
    var fakefs = getFs(file);
    return fakefs.stat(file, callback);
  },

  createReadStream(file, options) {
    if (options && (options.start || options.end)) {
      throw new Error("Stream positioning not supported");
    }

    var fakefs = getFs(file);
    return fakefs.createReadStream(file);
  },
};

/**
 * Map from a filename to the custom filesystem implementation used to read the
 * file
 */
function getFs(file) {
  if (file.match(/\.css$/)) {
    return cssfs;
  }

  return plainfs;
}

/**
 * The default action is - just what the filesystem says
 */
var plainfs = {
  stat(file, callback) {
    return fs.stat(file, callback);
  },

  createReadStream(file, options) {
    return fs.createReadStream(file, options);
  }
};

/**
 * The default action is - just what the filesystem says
 */
var cssfs = {
  stat(file, callback) {
    console.log(file);
    return fs.stat(file, callback);
  },

  createReadStream(file, options) {
    var original = fs.readFileSync(file).toString('utf-8');

    var options = {
      import: false,
      messages: {
        browser: false,
        console: true,
      },
      from: file,
    };
    var reply = cssnext(original, options);

    var out = new Readable();
    out.push(reply);
    out.push(null);
    return out;
  }
};
