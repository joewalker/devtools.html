/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {Cc, Ci, Cu} = require("devtools/sham/chrome");
const promise = require("devtools/sham/promise");

const EventEmitter = require("devtools/shared/event-emitter");

let { DebuggerClient } = require("devtools/shared/client/main");
let { DebuggerTransport } = require("devtools/shared/transport/transport");
let { Task } = require("devtools/sham/task");
let { TargetFactory } = require("devtools/client/framework/target");
let { InspectorFront } = require("devtools/server/actors/inspector");

let WEB_SOCKET_PORT = 9000;

/**
 * A DevToolPanel that controls the Web Console.
 */
function WebConsolePanel(iframeWindow, toolbox)
{
  this._frameWindow = iframeWindow;
  this._toolbox = toolbox;
  EventEmitter.decorate(this);
}

exports.WebConsolePanel = WebConsolePanel;

WebConsolePanel.prototype = {
  hud: null,

  focusInput: function()
  {
  },

  open: Task.async(function*()
  {
    this.webConsoleClient = yield initConnection();
    yield initView(this._frameWindow.document);

    this.isReady = true;
    this.emit("ready");
    return this;
  }),

  get target()
  {
    return this._toolbox.target;
  },

  destroy: function()
  {
  },
};

function initView(document) {
  let $ = selector => document.querySelectorAll(selector);

}

function* initConnection() {
  function getPort() {
    let query = location.search.match(/(\w+)=(\d+)/);
    if (query && query[1] == "wsPort") {
      return query[2];
    }
    return WEB_SOCKET_PORT;
  }

  let socket = new WebSocket("ws://localhost:" + getPort());
  let transport = new DebuggerTransport(socket);
  let client = new DebuggerClient(transport);
  yield client.connect();

  let response = yield client.listTabs();
  let tab = response.tabs[response.selected];

  let options = {
    form: tab,
    client,
    chrome: false,
  };
  let target = yield TargetFactory.forRemoteTab(options);

  return target.activeConsole;
}
