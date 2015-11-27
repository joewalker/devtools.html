/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

/**
 * This component renders <MenuPopup> element.
 */
var MenuPopup = React.createClass({
/** @lends MenuPopup */

  displayName: "MenuPopup",

  render: function() {
    let id = this.props.id;
    let items = this.props.items;

    let menuItems = items.map(item =>
      React.createElement("menuitem", {
        is: item.id
      })
    );

    return React.createElement("menupopup", {id: id},
      menuItems
    );
  }
});

// Exports from this module
module.exports = {
  MenuPopup: MenuPopup
}
