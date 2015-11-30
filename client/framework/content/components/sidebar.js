/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function(require, exports/*, module*/) {

"use strict";

// ReactJS
const React = require("react");

// Stylesheets
const css = require("./sidebar.css");

// App
const { createFactories } = require("../utils");
const { Tabs, TabPanel } = createFactories(require("./tabs"));

/**
 * @template This template represents a Sidebar for panels.
 */
var Sidebar = React.createClass({
/** @lends Sidebar */

  displayName: "Sidebar",

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

    return (
      Tabs({tabActive: tabActive, onAfterChange: this.onTabChanged},
        this.props.children
      )
    );
  }
});

// Exports from this module
exports.Sidebar = Sidebar;
});
