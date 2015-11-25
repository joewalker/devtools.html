/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Components
const { createFactories } = require("../../components/utils");
const { Toolbar, ToolbarButton } = createFactories(require("../../components/toolbar"));

// Shortcuts
const { div } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var ComputedPanel = React.createClass({
/** @lends ComputedPanel */

  displayName: "ComputedPanel",

  render: function() {
    return (
      div({className: "ComputedPanel"},
        ComputedToolbar()
      )
    );
  }
});

/**
 * @template This object is responsible for rendering a toolbar
 */
var ComputedToolbar = React.createFactory(React.createClass({
/** @lends ComputedToolbar */

  displayName: "ComputedToolbar",

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
  ComputedPanel: ComputedPanel
}
