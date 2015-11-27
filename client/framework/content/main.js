/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// DevTools
const { createFactories } = require("./utils");

// React
const React = require("react");
const ReactDOM = require("react-dom");

// Redux
const { Provider } = createFactories(require("react-redux"));

// App
const { Toolbox } = createFactories(require("./containers/toolbox"));
const { configureStore } = require("./store/configure-store");

var store = configureStore();

/**
 * Render top-level application component - the Toolbox.
 */
const content = document.getElementById("content");
const theApp = ReactDOM.render(Provider({store: store},
  Toolbox({})
), content);

// View Resizer

/**
 * This object is responsible for setting proper body height
 * when the window changes its size.
 */
function Resizer(win) {
  this.win = win;
  this.win.addEventListener("resize", this.onResize.bind(this));
  this.onResize();
}

Resizer.prototype =
/** @lends Resizer */
{
  onResize: function() {
    var doc = this.win.document;
    doc.body.style.height = this.win.innerHeight + "px";
    doc.body.style.width = this.win.innerWidth + "px";
  }
};

var resizer = new Resizer(window);
