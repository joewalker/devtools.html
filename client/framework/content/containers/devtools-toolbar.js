/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("react");

// DevTools
const { createFactories, createFactory } = require("../utils");
const { MenuPopup } = createFactories(require("../components/xul/menu-popup"));

// Shortcuts
const box = createFactory("box");
const vbox = createFactory("vbox");
const hbox = createFactory("hbox");
const toolbar = createFactory("toolbar");
const button = createFactory("button");
const { div } = React.DOM;

/**
 * This component renders DevTools Toolbar. It's contains buttons
 * as well as panel tabs.
 */
var DevToolsToolbar = React.createClass({
  displayName: "DevToolsToolbar",

  render: function() {
    return (
      toolbar({className: "devtools-tabbar"},
        hbox({id: "toolbox-picker-container"}),
        hbox({id: "toolbox-tabs", flex: "1", role: "tablist", is: ""}),
        hbox({id: "toolbox-buttons", pack: "end", is: ""},
          button({
            id: "command-button-frames",
            className: "command-button command-button-invertable devtools-toolbarbutton devtools-button",
            tooltiptext: ";AMP;toolboxFramesTooltip;",
            type: "menu",
            hidden: "true"},
              MenuPopup({position: "bottomright topright"})
          )
        ),
        vbox({id: "toolbox-controls-separator", className: "devtools-separator"}),
        hbox({id: "toolbox-option-container"}),
        hbox({id: "toolbox-controls"},
          hbox({id: "toolbox-dock-buttons"}),
          button({
            id: "toolbox-close",
            className: "devtools-closebutton devtools-button",
            tooltiptext: ";AMP;toolboxCloseButton.tooltip;",
            is: ""
          })
        )
      )
    )
  }
});

module.exports = {
  DevToolsToolbar: DevToolsToolbar
};
