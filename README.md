# devtools.html

## Setup

Install `gulp` globally and all dependencies.

* `$ npm install gulp -g`
* `$ npm install`

## Building

* `$ webpack --progress --color --watch` Builds all webpacked projects, and
  waits for changes. This is *much* quicker than `gulp watch` because webpack
  caches the parsed JS files, and only outputs the changes
* `$ gulp build-prefs` Creates the `./build/preferences.json` file; only need
  to run if `client/preferences/devtools.js` changes.

## Running the server

1. Start server in Firefox with `listen` in GCLI (uses default port 6080)
2. Run `gulp serve-connect` to start proxy and build the connection test tool
  * Can also use just `gulp start-proxy` if you don't care about the test tool

It's worth noting that the server serves everything in the devtools.html
directory to localhost. This is probably OK unless you either don't trust
yourself, or you open the port to the network and store private files in this
directory.

## Sights worth seeing

* `http://localhost:8081/?wsPort=9000` to run the connection test tool. You
  should see something like this:

    Success!  Check console for protocol logs.
    TabTarget:server2.conn26.child13/tab1
    [Front for inspector/server2.conn26.child13/inspectorActor3]
    [Front for domwalker/server2.conn26.child13/domwalker28]

  And see TCP -> WS logs in the console where you ran `gulp serve-connect`

* `http://localhost:8081/devtools/test/index.html` to run the unit tests
* `http://localhost:8081/devtools/client/framework/toolbox-wrapper.html` runs the
  toolbox itself.

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
