/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {Cc, Ci, Cu} = require("devtools/sham/chrome");
const promise = require("devtools/sham/promise");
const EventEmitter = require("devtools/shared/event-emitter");

const {DebuggerClient} = require("devtools/shared/client/main");
const {DebuggerTransport} = require("devtools/shared/transport/transport");
const {TargetFactory} = require("devtools/client/framework/target");

const WEB_SOCKET_PORT = 9000;

class WebConsolePanel {
  constructor(iframeWindow, toolbox) {
    this._frameWindow = iframeWindow;
    this._toolbox = toolbox;
    EventEmitter.decorate(this);
  }

  async open() {
    this.controller = new Controller();
    await this.controller.connect();

    this.view = new View(this._frameWindow.document);
    await this.view.init();

    this.presenter = new Presenter(this.view, this.controller);
    await this.presenter.init();

    this.isReady = true;
    this.emit("ready");
    return this;
  }

  get target() {
    return this._toolbox.target;
  }

  destroy() {
  }

  focusInput() {
    this.view.focusInput();
  }
}

let EventsQueue = {
  _queue: [],

  register: function(f) {
    let self = this;

    return function(...args) {
      self._queue.push([this, f, args]);
      self._onInvoke();
    };
  },

  _onInvoke: async function() {
    if (this._popping) {
      return;
    }

    this._popping = true;

    while (this._queue.length) {
      let [self, f, args] = this._queue.pop();
      await f.apply(self, args);
    }

    this._popping = false;
  }
};

class Controller {
  async connect() {
    let socket = new WebSocket("ws://localhost:" + this._getPort());
    let transport = new DebuggerTransport(socket);
    let client = new DebuggerClient(transport);
    await client.connect();

    let response = await client.listTabs();
    let tab = response.tabs[response.selected];

    let target = await TargetFactory.forRemoteTab({
      form: tab,
      client: client,
      chrome: false,
    });

    this.webConsoleClient = target.activeConsole;
  }

  evaluate(value) {
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
  }

  _getPort() {
    let query = location.search.match(/(\w+)=(\d+)/);
    if (query && query[1] == "wsPort") {
      return query[2];
    }
    return WEB_SOCKET_PORT;
  }
}

class View {
  constructor(document) {
    this.$ = selector => document.querySelectorAll(selector)[0];
    EventEmitter.decorate(this);

    this._onJsInput = EventsQueue.register(this._onJsInput);
  }

  init() {
    this.inputNode.addEventListener("keypress", this._onJsInput.bind(this));
  }

  get outputNode() {
    return this.$("#js-output");
  }

  get inputNode() {
    return this.$("#js-input");
  }

  focusInput() {
    this.inputNode.focus();
  }

  clearInput() {
    this.inputNode.value = "";
  }

  appendOutput(result) {
    let message = new ConsoleMessageView(this.outputNode);
    message.render(result);
  }

  _onJsInput(e) {
    if (e.keyCode == 13 /* ENTER */) {
      let value = this.inputNode.value;
      this.emit("js-eval", value);
    }
  }
}

class Presenter {
  constructor(view, controller) {
    this.view = view;
    this.controller = controller;

    this._onJsInput = EventsQueue.register(this._onJsInput);
  }

  init() {
    this.view.on("js-eval", this._onJsInput.bind(this));
  }

  async _onJsInput(event, value) {
    let [error, result] = await this.controller.evaluate(value);
    this.view.appendOutput(result);
    this.view.clearInput();
  }
}

class UIElement {
  constructor(parentNode) {
    this.parent = parentNode;
    this.document = parentNode.ownerDocument;
    this.window = parentNode.ownerDocument.defaultView;

    this.view = this.document.createElement("div");
    this.parent.appendChild(this.view);
  }

  clear() {
    this.view.innerHTML = "";
  }
}

class ConsoleMessageView extends UIElement {
  render(object) {
    this.clear();

    this.view.className = ".console-message";
    this.view.setAttribute("category", "input");

    let messageNode = this.document.createElement("div");
    messageNode.textContent = object;

    this.view.appendChild(messageNode);
  }
}

exports.WebConsolePanel = WebConsolePanel;
