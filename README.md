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

## Running the server and using the toolbox

1. Start server in Firefox with `listen` in GCLI (uses default port 6080)
2. Run `gulp start` to start the proxy and static dev server.
3. Open http://localhost:8081/client/framework/toolbox-wrapper.html in a tab.

It's worth noting that the server serves everything in the devtools.html
directory to localhost:8081. This is probably OK unless you either don't trust
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


## Connecting to Chrome

1. Start Chrome with at least `--remote-debugging-port=9222` CLI arg
  * Full OS X command: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --remote-debugging-port=9222`
  * More details in [Valence README](https://github.com/mozilla/valence/blob/master/README.md#debugging-chrome-on-desktop)
2. Ensure some page is open in Chrome for inspecting
3. Run `gulp start`
4. Navigate to `http://localhost:8081/?wsPort=9001` to run the connection test tool, or the toolbox
   at `http://localhost:8081/client/framework/toolbox-wrapper.html`
5. If you view the toolbox, you'll need to change the `if` statement in `getWSTarget` in `client/framework/toolbox.js` to true.

## Connecting to Servo

Initial setup:

```
$ git clone https://github.com/servo/servo.git
$ cd servo/
$ ./mach build -r # release build
```

Start servo with a devtools server listening on port 6080 and open to mozilla.org:

```
$ ./mach run --devtools 6080 https://google.com
```

See also:

* https://github.com/servo/servo/wiki/Devtools

* https://github.com/servo/servo/wiki/Devtools-plans
