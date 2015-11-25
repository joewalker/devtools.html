/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Stylesheets
const css = require("./rules-panel.css");

// Components
const { createFactories } = require("../../components/utils");
const { Toolbar, ToolbarButton } = createFactories(require("../../components/toolbar"));

// Shortcuts
const { div } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var RulesPanel = React.createClass({
/** @lends RulesPanel */

  displayName: "RulesPanel",

  render: function() {
    return (
      div({className: "rulesPanel"},
        RulesToolbar()
      )
    );
  }
});

/**
 * @template This object is responsible for rendering a toolbar
 */
var RulesToolbar = React.createFactory(React.createClass({
/** @lends RulesToolbar */

  displayName: "RulesToolbar",

  getInitialState: function () {
    return {
    }
  },

  // Commands

  onRefresh: function() {
  },

  // Render

  render: function() {
    return (
      Toolbar({className: "toolbar", ref: "toolbar"},
        ToolbarButton({bsSize: "xsmall", onClick: this.onRefresh},
          "Refresh"
        )
      )
    );
  },
}));

// Exports from this module
module.exports = {
  RulesPanel: RulesPanel
}
