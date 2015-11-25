# devtools.html

## Setup

Install `gulp` globally and all dependencies.

* `$ npm install gulp -g`
* `$ npm install`

## Building

* `$ gulp build` Builds all webpacked projects in `./client/*` -- right now, only `./client/inspector`. Should add `gulp build {tool}` later.

* `$ gulp watch` Watches the file system for changes and calls build when that happens.
* `$ gulp build-prefs` Creates the `./build/preferences.json` file; only need to run if `client/preferences/devtools.js` changes.
* `$ gulp build-test` Builds the test file js.

## Testing

Ensure tests are built via webpack with `gulp build-test`. Run tests by opening up `./test/index.html`. The build also includes the lib files packed up, so if the source code changes, you'll also have to rebuild the tests.

## Connection Test in Firefox

1. Start server in Firefox with `listen` in GCLI (uses default port 6080)
2. Run `gulp serve-connect` to start proxy and build the connection test tool
3. Open http://localhost:8001 to run the connection test tool
