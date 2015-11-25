/* eslint-env browser */
"use strict";

let { DebuggerClient } = require("devtools/shared/client/main");
let { DebuggerTransport } = require("devtools/shared/transport/transport");

let gClient;

exports.start = () => {
  let socket = new WebSocket("ws://localhost:9000");
  let transport = new DebuggerTransport(socket);
  gClient = new DebuggerClient(transport);
  gClient.connect(onConnect);
};

function onConnect() {
  gClient.listTabs(onTabs);
}

function onTabs(response) {
  let output = document.getElementById("output");
  output.textContent = JSON.stringify(response, null, 2);
}
