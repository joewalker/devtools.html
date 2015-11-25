/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Stylesheets
const cssBases = require("./base.css");
const cssToolbox = require("./toolbox.css");
const cssVariables = require("./variables.css");

// Components
const { createFactories } = require("../components/utils");
const { Tabs, TabPanel } = createFactories(require("../components/tabs"));
const { MainToolbar } = createFactories(require("./main-toolbar"));

// Panels
const { InspectorPanel } = createFactories(require("./inspector/inspector-panel"));
const { DomPanel } = createFactories(require("./dom/dom-panel"));
const { ConsolePanel } = createFactories(require("./console/console-panel"));

// Shortcuts
const { div } = React.DOM;

/**
 * Top level application component
 */
var Toolbox = React.createClass({
  displayName: "HelloReact",

  getInitialState: function() {
    return {
      tabActive: 1,
   };
  },

  onTabChanged: function(index) {
    this.setState({tabActive: index});
  },

  render: function() {
    var tabActive = this.state.tabActive;
    var selectedFrame = this.props.selection || {};

    var tabs = [
      TabPanel({className: "console", key: "inspector",
        title: "Console"},
        ConsolePanel(this.props)
      ),
      TabPanel({className: "inspector", key: "inspector",
        title: "Inspector"},
        InspectorPanel(this.props)
      ),
      TabPanel({className: "dom", key: "dom",
        title: "DOM"},
        DomPanel(this.props)
      ),
    ];

    return (
      Tabs({tabActive: tabActive, onAfterChange: this.onTabChanged},
        tabs
      )
    );
  }
});

module.exports = {
  Toolbox: Toolbox
};
