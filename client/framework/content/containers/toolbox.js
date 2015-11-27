/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("react");
const { connect } = require("react-redux");

// Stylesheets
const cssToolbox = require("./toolbox.css");

// DevTools
const { createFactories } = require("../utils");
const { KeySet } = createFactories(require("../components/xul/keyset"));
const { PopupSet } = createFactories(require("../components/xul/popupset"));
const { CommandSet } = createFactories(require("../components/xul/commandset"));
const { ToolboxNotificationBox } = createFactories(require("./toolbox-notification-box"));

// Shortcuts
const { div } = React.DOM;

/**
 * Top level DevTools component
 */
var Toolbox = React.createClass({
  displayName: "Toolbox",

  getInitialState: function() {
    return {
    };
  },

  onTabChanged: function(index) {
    this.setState({tabActive: index});
  },

  render: function() {
    let keysets = this.props.keysets.map(keyset => KeySet({keyset: keyset}));
    let popupset = PopupSet({popupset: this.props.popupset});
    let commandset = CommandSet({commandset: this.props.commandset});

    // Render the Toolbox
    return (
      div({},
        keysets,
        popupset,
        commandset,
        ToolboxNotificationBox(this.props)
      )
    );
  }
});

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    keysets: state.keysets,
    popupset: state.popupset,
    commandset: state.commandset
  };
}

module.exports = {
  Toolbox: connect(mapStateToProps)(Toolbox)
};
