/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Dependencies
const React = require("react");

/**
 * This component renders <keyset> element.
 */
var KeySet = React.createClass({
/** @lends KeySet */

  displayName: "KeySet",

  render: function() {
    let keyset = this.props.keyset;

    let keys = keyset.keys.map(key =>
      React.createElement("key", {
        is: "",
        id: key.id,
        key: key.key,
        keycode: key.keycode,
        oncommand: key.oncommand,
        modifiers: key.modifiers,
      })
    );

    return React.createElement("keyset", {
      id: keyset.id,
      key: "key-" + keyset.id
    }, keys);
  }
});

// Exports from this module
module.exports = {
  KeySet: KeySet,
}
