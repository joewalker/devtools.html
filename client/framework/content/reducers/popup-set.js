/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const initialState = [{
  id: "toolbox-textbox-context-popup",
  items: [
    { "id": "cMenu_undo" },
    { "id": "cMenu_cut" },
    { "id": "cMenu_copy" },
    { "id": "cMenu_paste" },
    { "id": "cMenu_delete" },
    { "id": "cMenu_selectAll" }
  ]
}];

function popupset(state = initialState, action) {
  // No actions for now
  return state;
}

// Exports from this module
exports.popupset = popupset;

