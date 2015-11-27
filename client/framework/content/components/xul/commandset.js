/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Dependencies
const React = require("react");

/**
 * This component renders <commandset> element.
 */
var CommandSet = React.createClass({
/** @lends CommandSet */

  displayName: "CommandSet",

  render: function() {
    let commandset = this.props.commandset;

    let commands = commandset.commands.map(command =>
      React.createElement("command", {
        is: "",
        id: command.id,
        key: "key-" + command.id,
      })
    );

    return React.createElement("commandset", {
      id: commandset.id,
      key: "key-" + commandset.id
    }, commands);
  }
});

// Exports from this module
module.exports = {
  CommandSet: CommandSet,
}
