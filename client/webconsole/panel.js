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

function WebConsolePanel(iframeWindow, toolbox) {
  this._frameWindow = iframeWindow;
  this._toolbox = toolbox;
  EventEmitter.decorate(this);
}

exports.WebConsolePanel = WebConsolePanel;

WebConsolePanel.prototype = {
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

  focusInput: function() {
    this.view.focusInput();
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
    let deferred = promise.defer();

    this.webConsoleClient.evaluateJSAsync(value, response => {
      if (response.error) {
        deferred.reject(response);
      }
      else if (response.exception !== null) {
        deferred.resolve([response]);
      }
      else {
        deferred.resolve([undefined, response.result]);
      }
    });

    return deferred.promise;
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
  get outputNode() {
    return this.$("#js-output");
  },

  get inputNode() {
    return this.$("#js-input");
  },

  init: function*() {
    this.inputNode.addEventListener("keypress", this._onJsInput.bind(this));
  },

  focusInput: function() {
    this.inputNode.focus();
  },

  clearInput: function() {
    this.inputNode.value = "";
  },

  appendOutput: function(error, result) {
    let message = new ConsoleMessageView(this.outputNode);
    message.render(error, result);
  },

  _onJsInput: EventsQueue.register(function(e) {
    if (e.keyCode == 13 /* ENTER */) {
      let value = this.inputNode.value;
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

  _onJsInput: EventsQueue.register(function*(event, value) {
    let response = yield this.controller.eval(value);
    this.view.appendOutput(...response);
    this.view.clearInput();
  })
};

function UIElement(parentNode) {
  this.parent = parentNode;
  this.document = parentNode.ownerDocument;
  this.window = parentNode.ownerDocument.defaultView;

  this.view = this.document.createElement("div");
  this.parent.appendChild(this.view);
}

UIElement.prototype = {
  clear: function() {
    this.view.innerHTML = "";
  }
};

function ConsoleMessageView(parentNode) {
  UIElement.call(this, parentNode);
}

ConsoleMessageView.prototype = Object.create(UIElement.prototype);
ConsoleMessageView.constructor = ConsoleMessageView;

ConsoleMessageView.prototype.render = function(error, result) {
  this.clear();

  this.view.className = ".console-message";
  this.view.setAttribute("category", "input");

  let messageNode = this.document.createElement("div");
  messageNode.textContent = result;

  this.view.appendChild(messageNode);
};
