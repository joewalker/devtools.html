/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Components
const { createFactories } = require("../../components/utils");
const { Toolbar, ToolbarButton } = createFactories(require("../../components/toolbar"));
const { Sidebar } = createFactories(require("../../components/sidebar"));
const { Splitter } = createFactories(require("../../components/splitter"));

// Inspector
const { RulesPanel } = createFactories(require("./rules-panel"));
const { ComputedPanel } = createFactories(require("./computed-panel"));

// Shortcuts
const { div } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var InspectorPanel = React.createClass({
/** @lends InspectorPanel */

  displayName: "InspectorPanel",

  render: function() {
    // Render Inspector panel content. It consists of a toolbar,
    // content and sidebar with side panels.
    var leftPanel =
      div({className: "mainPanel"},
        InspectorToolbar(),
        div({className: "inspectorPanelContent"})
      );

    // Render side bar with side panels.
    var rightPanel =
      div({className: "inspectorSidePanel"},
        Sidebar({},
          RulesPanel({className: "rules", key: "rules", title: "Rules"}),
          ComputedPanel({className: "computed", key: "computed", title: "Computed"})
        )
      );

    return (
      div({className: "inspectorPanel"},
        Splitter({
          mode: "vertical",
          min: 200,
          leftPanel: leftPanel,
          rightPanel: rightPanel,
          innerBox: div({className: "innerBox"})
        })
      )
    );
  }
});

/**
 * @template This object is responsible for rendering the toolbar
 * in Actors tab
 */
var InspectorToolbar = React.createFactory(React.createClass({
/** @lends InspectorToolbar */

  displayName: "InspectorToolbar",

  // Commands

  onClear: function() {
  },

  onTogglePause: function() {
  },

  // Render

  render: function() {
    return (
      Toolbar({className: "toolbar", ref: "toolbar"},
        ToolbarButton({bsSize: "xsmall", onClick: this.onTogglePause},
          "Pause"
        ),
        ToolbarButton({bsSize: "xsmall", onClick: this.onClear},
          "Clear"
        )
      )
    )
  },
}));

// Exports from this module
module.exports = {
  InspectorPanel: InspectorPanel
}
