/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Redux
const { createStore } = require("redux");

// App
const { rootReducer } = require("../reducers/index");

function configureStore(initialState) {
  return createStore(rootReducer, initialState);
}

// Exports from this module
exports.configureStore = configureStore;

