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
  focusInput: function() {
    this.view.focusInput();
  },

  open: Task.async(function*() {
    this.controller = new Controller();
    yield this.controller.connect();

    this.view = new View(this._frameWindow.document);
    yield this.view.init();

    this.isReady = true;
    this.emit("ready");
    return this;
  }),

  get target() {
    return this._toolbox.target;
  },

  destroy: function() {
  },
};

function Controller() {
}

Controller.prototype = {
  connect: function*() {
    let socket = new WebSocket("ws://localhost:" + this._getPort());
    let transport = new DebuggerTransport(socket);
    let client = new DebuggerClient(transport);
    yield client.connect();

    let response = yield client.listTabs();
    let tab = response.tabs[response.selected];

    let target = yield TargetFactory.forRemoteTab({
      form: tab,
      client: client,
      chrome: false,
    });

    this.webConsoleClient = target.activeConsole;
  },

  _getPort: function() {
    let query = location.search.match(/(\w+)=(\d+)/);
    if (query && query[1] == "wsPort") {
      return query[2];
    }
    return WEB_SOCKET_PORT;
  },
};

function View(document) {
  this.$ = selector => document.querySelectorAll(selector)[0];
}

View.prototype = {
  init: function*() {
    this.$("#js-input").addEventListener("keypress", this._onJsInput.bind(this));
  },

  focusInput: function() {
    this.$("#js-input").focus();
  },

  _onJsInput: function(e) {
    if (e.keyCode == 13 /* ENTER */) {
      let value = this.$("#js-input").value;
    }
  }
};
