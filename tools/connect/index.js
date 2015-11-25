/* eslint-env browser */
"use strict";

let { DebuggerClient } = require("devtools/shared/client/main");
let { DebuggerTransport } = require("devtools/shared/transport/transport");
let { Task } = require("devtools/sham/task");
let { TargetFactory } = require("devtools/client/framework/target");
let { InspectorFront } = require("devtools/server/actors/inspector");

exports.start = Task.async(function*() {
  let socket = new WebSocket("ws://localhost:9000");
  let transport = new DebuggerTransport(socket);
  let client = new DebuggerClient(transport);
  yield client.connect();

  let response = yield client.listTabs();
  let tab = response.tabs[response.selected];
  let output = document.getElementById("output");
  output.textContent = "Success!  Check console for protocol logs.\n\n";

  let options = {
    form: tab,
    client,
    chrome: false,
  };
  let target = yield TargetFactory.forRemoteTab(options);
  output.textContent += target + "\n\n";

  /*let hostType = Toolbox.HostType.WINDOW;
  gDevTools.showToolbox(target, tool, hostType)*/

  let inspector = InspectorFront(target.client, target.form);
  output.textContent += inspector + "\n\n";

  let walker = yield inspector.getWalker();

  output.textContent += walker + "\n\n";
});
