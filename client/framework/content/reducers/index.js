/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Redux
const { combineReducers } = require("redux");

// DevTools
const { keysets } = require("./key-sets");
const { popupset } = require("./popup-set");
const { commandset } = require("./command-set");

var rootReducer = combineReducers({
  keysets,
  popupset,
  commandset
});

// Exports from this module
exports.rootReducer = rootReducer;

