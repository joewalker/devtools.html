/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// App
const { createFactories } = require("../components/utils");
const { Toolbar, ToolbarButton } = createFactories(require("../components/toolbar"));

/**
 * @template This object is responsible for rendering the toolbar
 * in Actors tab
 */
var MainToolbar = React.createClass({
/** @lends MainToolbar */

  displayName: "MainToolbar",

  getInitialState: function () {
    return {
      paused: false
    }
  },

  // Commands

  onTogglePause: function() {
  },

  onClear: function() {
  },

  // Render

  render: function() {
    return (
      Toolbar({className: "toolbar", ref: "toolbar"},
        ToolbarButton({bsSize: "xsmall", onClick: this.onTogglePause},
          "Inspector"
        ),
        ToolbarButton({bsSize: "xsmall", onClick: this.onClear},
          "Clear"
        )
      )
    );
  },
});

// Exports from this module
module.exports = {
  MainToolbar: MainToolbar
}
