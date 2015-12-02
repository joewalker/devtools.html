/* eslint-env browser */

"use strict";

let { DebuggerClient } = require("devtools/shared/client/main");
let { DebuggerTransport } = require("devtools/shared/transport/transport");
let { TargetFactory } = require("devtools/client/framework/target");
let { InspectorFront } = require("devtools/server/actors/inspector");

let WEB_SOCKET_PORT = 9000;

function getPort() {
  let query = location.search.match(/(\w+)=(\d+)/);
  if (query && query[1] == "wsPort") {
    return query[2];
  }
  return WEB_SOCKET_PORT;
}

function start() {
  let socket = new WebSocket("ws://localhost:" + getPort());
  let transport = new DebuggerTransport(socket);
  let client = new DebuggerClient(transport);

  return client.connect().then(() => {
    return client.listTabs().then(response => {
      let tab = response.tabs[response.selected];
      let output = document.getElementById("output");
      output.textContent = "Success!  Check console for protocol logs.\n\n";

      let options = {
        form: tab,
        client,
        chrome: false,
      };
      return TargetFactory.forRemoteTab(options).then(target => {
        output.textContent += target + "\n\n";

        /*let hostType = Toolbox.HostType.WINDOW;
        gDevTools.showToolbox(target, tool, hostType)*/

        let inspector = InspectorFront(target.client, target.form);
        output.textContent += inspector + "\n\n";

        return inspector.getWalker().then(walker => {
          output.textContent += walker + "\n\n";
        });
      });
    });
  });
}

start().then(data => console.log('started', data))
       .catch(err => console.error(err));
