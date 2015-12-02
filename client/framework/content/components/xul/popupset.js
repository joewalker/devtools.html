/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// DevTools
const { createFactories } = require("../../utils");
const { MenuPopup } = createFactories(require("./menu-popup"));

/**
 * This component renders <popupset> element.
 */
var PopupSet = React.createClass({
/** @lends PopupSet */

  displayName: "PopupSet",

  render: function() {
    let popupset = this.props.popupset;

    let menus = popupset.map(menu =>
      MenuPopup({
        id: menu.id,
        key: "key-" + menu.id,
        items: menu.items
      })
    );

    return React.createElement("popupset", {
      id: popupset.id
    }, menus);
  }
});

// Exports from this module
module.exports = {
  PopupSet: PopupSet
}
