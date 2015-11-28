
"use strict";

const fs = require("fs");
const path = require("path");
const babel = require("babel-core");
const properties = require("properties");

const { Readable } = require("stream");

const requireRegexp = /\.require\.js$/;

const requireScript = fs.readFileSync(__dirname + "/require.js").toString();
const polyfillPath = path.join(__dirname, "..", "..", "node_modules", "babel-polyfill", "dist", "polyfill.js");
const polyfillScript = fs.readFileSync(polyfillPath).toString();

/**
 * This is the filtering filesystem that we export to ecstatic
 */
var customfs = exports.customfs = {
  stat(file, callback) {
    const isRequire = file.match(requireRegexp);
    file = file.replace(requireRegexp, ".js");
    const fakefs = getFs(file, isRequire);
    return fakefs.stat(file, callback);
  },

  createReadStream(file, options) {
    const isRequire = file.match(requireRegexp);
    file = file.replace(requireRegexp, ".js");
    if (options && (options.start || options.end)) {
      throw new Error("Stream positioning not supported");
    }

    const fakefs = getFs(file, isRequire);
    return fakefs.createReadStream(file);
  },
};

/**
 * Map from a filename to the custom filesystem implementation used to read the
 * file
 */
function getFs(file, isRequire) {
  if (isRequire) {
    if (file.match(/\.properties\.js$/)) {
      return propertiesfs;
    }

    if (file.match(/\.json\.js$/)) {
      return jsonfs;
    }

    if (file.match(/\.js$/)) {
      return jsfs;
    }

    throw new Error("Unknown file requested by require: ", file);
  }

  if (file.match(/require\.js$/)) {
    return plainfs;
  }

  if (file.match(/\.js$/)) {
    return topjsfs;
  }

  return plainfs;
}

/**
 * The default action is - just what the filesystem says
 */
const plainfs = {
  stat(file, callback) {
    return fs.stat(file, callback);
  },

  createReadStream(file, options) {
    return fs.createReadStream(file, options);
  }
};

/**
 * Run the JS file through Babel, and AMD-define wrap for web delivery.
 * This is designed for all scripts that are loaded using `require(...)`,
 * rather than `<script src="...">`
 */
const jsfs = {
  stat(file, callback) {
    return fs.stat(file, callback);
  },

  createReadStream(file) {
    const original = fs.readFileSync(file);

    const compiled = babel.transform(original, {
      "presets": [ "es2015", "react", "stage-2", ]
    });

    const reply = "define(function(require, exports, module) {" +
                  compiled.code +
                  "\n});";

    const out = new Readable();
    out.push(reply);
    out.push(null);
    return out;
  }
};

/**
 * Run the JS file through Babel, and wrap for web delivery as a top level
 * script that is able to make 'require()' calls.
 * This is designed for all scripts that are loaded using `<script src="...">`,
 * rather than `require(...)`.
 */
const topjsfs = {
  stat(file, callback) {
    return fs.stat(file, callback);
  },
  createReadStream(file) {
    const root = path.join(__dirname, "..", "..");
    const requireName = '/devtools' + file.substr(root.length);

    // How we need to configure require to know how to get from this file to
    // the root, or - how many ".." should we include in the paths for
    // requirejs.config(...);
    const doubleDots = requireName.split('/').length - 2;
    const pathToRoot = new Array(doubleDots).fill('..').join('/');

    const original = fs.readFileSync(file);

    const compiled = babel.transform(original, {
      "presets": [ "es2015", "react", "stage-2", ]
    });

    const reply = `${requireScript}
${polyfillScript}

requirejs.config({
  baseUrl: 'lib',
  paths: {
    devtools: '${pathToRoot}',
    l10n: '${pathToRoot}/client/locales/en-US',
    acorn: '${pathToRoot}/shared/acorn',
    sdk: '${pathToRoot}/sdk',
  }
});
define('${requireName}', function(require, exports, module) {

console.log('Running script');
${compiled.code}

});
require([ '${requireName}' ]);
`;

    const out = new Readable();
    out.push(reply);
    out.push(null);
    return out;
  }
};

/**
* RequireJS asks for blah.json.js, we remove the '.js', make the json the
* module export, and AMD-define wrap for web delivery
 */
const jsonfs = {
  stat(file, callback) {
    const jsonfile = file.replace(/\.js$/, "");
    return fs.stat(jsonfile, callback);
  },

  createReadStream(file) {
    const jsonfile = file.replace(/\.js$/, "");
    const original = fs.readFileSync(jsonfile);

    const reply = "define(function(require, exports, module) {\n" +
                  "module.exports = " + original + ";\n" +
                  "});\n";

    const out = new Readable();
    out.push(reply);
    out.push(null);
    return out;
  }
};

/**
 * RequireJS asks for blah.properties.js, we remove the '.js', parse the
 * properties file to json, make the json the module export, and AMD-define
 * wrap for web delivery
 */
const propertiesfs = {
  stat(file, callback) {
    const propfile = file.replace(/\.js$/, "");
    return fs.stat(propfile, callback);
  },

  createReadStream(file) {
    const propfile = file.replace(/\.js$/, "");
    const original = fs.readFileSync(propfile);

    const out = new Readable();

    properties.parse(original.toString("utf8"), (err, result) => {
      if (err) {
        out.push(err);
        out.push(null);
      } else {
        const json = JSON.stringify(result, null, 2);
        const reply = "define(function(require, exports, module) {\n" +
                      "module.exports = " + json + ";\n" +
                      "});\n";
        out.push(reply);
        out.push(null);
      }
    });

    return out;
  }
};
