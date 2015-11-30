/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// DevTools
const { createFactories, BodyResizer } = require("./utils");

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
const theApp = ReactDOM.render(Provider({store: store},
  Toolbox({})
), document.body);

// Make sure the body takes the entire vertical space.
var resizer = new BodyResizer(window);
