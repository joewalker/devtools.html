/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

const { createFactories } = require("../../components/utils");
const { Toolbar, ToolbarButton } = createFactories(require("../../components/toolbar"));

// Shortcuts
const { div } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var DomPanel = React.createClass({
/** @lends DomPanel */

  displayName: "DomPanel",

  render: function() {
    var selectedFrame = this.props.selection || {};

    return (
      div({className: "domPanel"},
        DomToolbar()
      )
    );
  }
});

/**
 * @template This object is responsible for rendering the toolbar
 * in Actors tab
 */
var DomToolbar = React.createFactory(React.createClass({
/** @lends DomToolbar */

  displayName: "DomToolbar",

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
    )
  },
}));

// Exports from this module
module.exports = {
  DomPanel: DomPanel
}
