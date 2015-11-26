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

## Connecting to Firefox

1. Start server in Firefox with `listen` in GCLI (uses default port 6080)
2. Run `gulp serve-connect` to start proxy and build the connection test tool
  * Can also use just `gulp start-proxy` if you don't care about the test tool
3. Navigate to `http://localhost:8081/?wsPort=9000` to run the connection test tool

## Connecting to Chrome

1. Allow unsigned add-ons in Firefox: set `xpinstall.signatures.required` to `false` in `about:config`
2. Install the [special Valence build](http://people.mozilla.org/~rstinnett/devtools.html/valence/) for your OS
  * If you already had Valence installed previously, you should restart Firefox before proceeding, something's not currently unloading in the add-on
3. Start Chrome with at least `--remote-debugging-port=9222` CLI arg
  * Full OS X command: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --remote-debugging-port=9222`
  * More details in [Valence README](https://github.com/mozilla/valence/blob/master/README.md#debugging-chrome-on-desktop)
4. Ensure some page is open in Chrome for inspecting
5. Run `gulp serve-connect` to start proxy and build the connection test tool
  * Can also use just `gulp start-proxy` if you don't care about the test tool
6. Navigate to `http://localhost:8081/?wsPort=9001` to run the connection test tool

## Running

* After connecting to Firefox (see connection step above), run `gulp` build and then navigate to client/framework/toolbox-wrapper.html in a web browser.
