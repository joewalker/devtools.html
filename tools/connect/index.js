/* eslint-env browser */
"use strict";

let { DebuggerClient } = require("devtools/shared/client/main");
let { DebuggerTransport } = require("devtools/shared/transport/transport");
let Task = require("devtools/sham/task");

exports.start = Task.async(function*() {
  let socket = new WebSocket("ws://localhost:9000");
  let transport = new DebuggerTransport(socket);
  let client = new DebuggerClient(transport);
  yield client.connect();
  let tabs = yield client.listTabs();
  let output = document.getElementById("output");
  output.textContent = JSON.stringify(tabs, null, 2);
});
