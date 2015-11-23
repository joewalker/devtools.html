var Cu = Components.utils;
var Cc = Components.classes;
var Ci = Components.interfaces;

const { Services } = require("devtools/sham/services.js");

// Always log packets when running tests.
Services.prefs.setBoolPref("devtools.debugger.log", true);
SimpleTest.registerCleanupFunction(function() {
  Services.prefs.clearUserPref("devtools.debugger.log");
});

var { Task } = require("devtools/sham/task.js");
var { require } =
  Cu.import("resource://devtools/shared/Loader.jsm", {});

var { DebuggerClient } = require("devtools/shared/client/main");
var { DebuggerServer } = require("devtools/server/main");
var { MemprofFront } = require("devtools/server/actors/memprof");

function startServerAndGetSelectedTabMemprof() {
  DebuggerServer.init();
  DebuggerServer.addBrowserActors();
  var client = new DebuggerClient(DebuggerServer.connectPipe());

  return new Promise((resolve, reject) => {
    client.connect(response => {
      if (response.error) {
        reject(new Error(response.error + ": " + response.message));
        return;
      }

      client.listTabs(response => {
        if (response.error) {
          reject(new Error(response.error + ": " + response.message));
          return;
        }

        var form = response.tabs[response.selected];
        var memprof = MemprofFront(client, form);

        resolve({ memprof, client });
      });
    });
  });
}

function destroyServerAndFinish(client) {
  client.close(() => {
    DebuggerServer.destroy();
    SimpleTest.finish();
  });
}
