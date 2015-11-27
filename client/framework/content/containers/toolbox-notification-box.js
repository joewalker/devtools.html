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
    // Setup splitter panel first

    // Set large flex for 'toolbox-deck' to allow the toolbox-panel-webconsole
    // to have a height set to a small value without flexing to fill up extra
    // space. There must be a flex on both to ensure that the console
    // panel itself is sized properly -->
    return (
      vbox({id: "toolbox-notificationbox", flex: "1", is: ""},
        DevToolsToolbar(this.props),
        vbox({flex: "1", is: ""},
          box({id: "toolbox-deck", flex: "1000", minheight: "75", is: ""})
        ),
        box({
          id: "toolbox-console-splitter",
          className: "devtools-horizontal-splitter",
          hidden: "true",
          is: ""

          //xxxHonza: Real splitter needs this
          /*mode: "vertical",
          min: 200,
          leftPanel: leftPanel,
          rightPanel: rightPanel,
          innerBox: div({className: "innerBox"})*/
        }),
        box({
          id: "toolbox-panel-webconsole",
          flex: "1",
          minheight: "75",
          collapsed: "true",
          is: ""
        })
      )
    )
  }
});

module.exports = {
  ToolboxNotificationBox: ToolboxNotificationBox
};
