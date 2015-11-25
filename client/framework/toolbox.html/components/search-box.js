/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Dependencies
const React = require("react");

// Stylesheets
const css = require("./search-box.css");

// Shortcuts
const { input } = React.DOM;

/**
 * This component renders a search box that allows the
 * user to filter on the content of the frames in the
 * list. It dispatches a "filterFrames" event with the
 * updated text filter.
 */
var SearchBox = React.createClass({
/** @lends SearchBox */

  displayName: "SearchBox",

  render: function() {
    return input({
      className: "devtools-searchinput",
      type: "search",
      results: "true"
    });
  }
});

// Exports from this module
module.exports = {
  SearchBox: SearchBox,
}
