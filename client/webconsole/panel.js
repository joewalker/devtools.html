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

    this.presenter = new Presenter(this.view, this.controller);
    yield this.presenter.init();

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

let EventsQueue = {
  _queue: [],

  register: function(f) {
    let self = this;

    return function(...args) {
      self._queue.push([this, f, args]);
      self._onInvoke();
    };
  },

  _onInvoke: Task.async(function*() {
    if (this._popping) {
      return;
    }

    this._popping = true;

    while (this._queue.length) {
      let [self, f, args] = this._queue.pop();
      yield f.apply(self, args);
    }

    this._popping = false;
  })
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

  eval: function(value) {
    debugger;
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
  EventEmitter.decorate(this);
}

View.prototype = {
  init: function*() {
    this.$("#js-input").addEventListener("keypress", this._onJsInput.bind(this));
  },

  focusInput: function() {
    this.$("#js-input").focus();
  },

  _onJsInput: EventsQueue.register(function(e) {
    if (e.keyCode == 13 /* ENTER */) {
      let value = this.$("#js-input").value;
      this.emit("js-eval", value);
    }
  })
};

function Presenter(view, controller) {
  this.view = view;
  this.controller = controller;
}

Presenter.prototype = {
  init: function*() {
    this.view.on("js-eval", this._onJsInput.bind(this));
  },

  _onJsInput: EventsQueue.register(function*(value) {
    yield this.controller.eval(value);
  })
};
