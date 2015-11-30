/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// Components
const { createFactories } = require("../../../framework/content/utils");

// Shortcuts
const { div } = React.DOM;

/**
 * Component responsible for rendering the Inspector tab.
 */
var GenericPanel = React.createClass({
/** @lends GenericPanel */

  displayName: "GenericPanel",

  render: function() {
    return div({})
  }
});

// Exports from this module
module.exports = {
  GenericPanel: GenericPanel
}
