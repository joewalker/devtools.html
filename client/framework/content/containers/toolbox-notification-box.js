/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("react");

// DevTools
const { createFactories, createFactory } = require("../utils");
const { DevToolsToolbar } = createFactories(require("./devtools-toolbar"));
const { Splitter } = createFactories(require("../components/splitter"));

// Shortcuts
const vbox = createFactory("vbox");
const box = createFactory("box");
const { div } = React.DOM;

/**
 * This component renders DevTools UI. It's composed from the toolbar
 * and the toolbox deck area.
 */
var ToolboxNotificationBox = React.createClass({
  displayName: "ToolboxNotificationBox",

  render: function() {
    // Set large flex for 'toolbox-deck' to allow the toolbox-panel-webconsole
    // to have a height set to a small value without flexing to fill up extra
    // space. There must be a flex on both to ensure that the console
    // panel itself is sized properly -->
    var topPanel = div({flex: "1000", is: "", class: "toolbox-content"},
      DevToolsToolbar(this.props),
      box({id: "toolbox-deck", flex: "1000", is: ""})
    );

    var bottomPanel = box({
      id: "toolbox-panel-webconsole",
      flex: "1",
      collapsed: "true",
      is: ""
    });

    return (
      div({id: "toolbox-notificationbox", flex: "1", is: ""},
        Splitter({
          //id: "toolbox-console-splitter",
          min: 50,
          mode: "horizontal",
          topPanel: topPanel,
          bottomPanel: bottomPanel
        })
      )
    )
  }
});

module.exports = {
  ToolboxNotificationBox: ToolboxNotificationBox
};
