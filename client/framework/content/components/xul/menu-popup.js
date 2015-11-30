/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React
const React = require("react");

// DevTools
const { createFactories } = require("../../utils");

/**
 * This component renders <MenuPopup> element.
 */
var MenuPopup = React.createClass({
/** @lends MenuPopup */

  displayName: "MenuPopup",

  render: function() {
    let id = this.props.id;
    let items = this.props.items || [];

    let menuItems = items.map(item => {
      switch (item.type) {
        case "menuseparator":
          return React.createElement("menuseparator", {id: item.id});
        case "menu":
          // this is undefined React error FIXME
          //return MenuFactory({id: item.id}, items);
        default:
          return React.createElement("menuitem", {id: item.id});
      }
    });

    return React.createElement("menupopup", {id: id},
      menuItems
    );
  }
});

/**
 * This component renders <Menu> element.
 */
var Menu = React.createClass({
/** @lends Menu */

  displayName: "Menu",

  render: function() {
    let id = this.props.id;
    let items = this.props.items || [];

    return React.createElement("menu", {id: id},
      MenuPopup({
        items: items
      })
    );
  }
});

var MenuFactory = React.createFactory(Menu);

// Exports from this module
module.exports = {
  MenuPopup: MenuPopup,
  Menu: Menu
}
