/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const initialState = [{
    "id": "editMenuKeys",
    "keys": []
  }, {
    "id": "toolbox-keyset",
    "keys": [
      {
        "id": "toolbox-options-key",
        "key": ";AMP;toolboxOptionsButton.key;",
        "oncommand": "void(0);",
        "modifiers": "shift, accel"
      },
      {
        "id": "toolbox-options-key2",
        "keycode": ";AMP;openHelp.commandkey;",
        "oncommand": "void(0);"
      },
      {
        "id": "toolbox-next-tool-key",
        "key": ";AMP;toolboxNextTool.key;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-previous-tool-key",
        "key": ";AMP;toolboxPreviousTool.key;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-in-key",
        "key": ";AMP;fullZoomEnlargeCmd.commandkey;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-in-key2",
        "key": ";AMP;fullZoomEnlargeCmd.commandkey2;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-in-key3",
        "key": ";AMP;fullZoomEnlargeCmd.commandkey3;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-out-key",
        "key": ";AMP;fullZoomReduceCmd.commandkey;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-out-key2",
        "key": ";AMP;fullZoomReduceCmd.commandkey2;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-reset-key",
        "key": ";AMP;fullZoomResetCmd.commandkey;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-zoom-reset-key2",
        "key": ";AMP;fullZoomResetCmd.commandkey2;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-reload-key",
        "key": ";AMP;toolboxReload.key;;",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-force-reload-key",
        "key": ";AMP;toolboxReload.key;",
        "oncommand": "void(0);",
        "modifiers": "accel shift"
      },
      {
        "id": "toolbox-reload-key2",
        "keycode": "VK_F5",
        "oncommand": "void(0);"
      },
      {
        "id": "toolbox-force-reload-key2",
        "keycode": "VK_F5",
        "oncommand": "void(0);",
        "modifiers": "accel"
      },
      {
        "id": "toolbox-minimize-key",
        "key": ";AMP;toolboxToggleMinimize.key;",
        "oncommand": "void(0);",
        "modifiers": "shift, accel"
      },
      {
        "id": "toolbox-toggle-host-key",
        "key": ";AMP;toolboxToggle.key;",
        "oncommand": "void(0);",
        "modifiers": "accel shift"
      },
      {
        "id": "tools-reload-key",
        "key": ";AMP;toolboxReload.key;;;",
        "oncommand": "void(0);",
        "modifiers": "accel alt"
      }
    ]
  }
];

function keysets(state = initialState, action) {
  // No actions for now
  return state;
}

// Exports from this module
exports.keysets = keysets;

