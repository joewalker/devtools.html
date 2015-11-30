/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {Cc, Ci, Cu} = require("devtools/sham/chrome");
const promise = require("devtools/sham/promise");

const EventEmitter = require("devtools/shared/event-emitter");

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

  open: function()
  {
    this.isReady = true;
    this.emit("ready");
    return this;
  },

  get target()
  {
    return this._toolbox.target;
  },

  destroy: function()
  {
  },
};
