/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Components
const { createFactories } = require("../../../framework/content/utils");

// Shortcuts
const { div, iframe } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var RulesPanel = React.createClass({
/** @lends RulesPanel */

  displayName: "RulesPanel",

  render: function() {
    return (
      iframe({
        class: "iframe-ruleview",
        flex: "1",
        src: "../styleinspector/cssruleview.xhtml",
        tooltip: "aHTMLTooltip",
        is: ""
      })
    );
  }
});

// Exports from this module
module.exports = {
  RulesPanel: RulesPanel
}
