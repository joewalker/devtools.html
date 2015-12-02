/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const React = require("react");
const { connect } = require("react-redux");

// Stylesheets
const css = require("./inspector.css");

// DevTools
const { createFactories, createFactory } = require("../../../framework/content/utils");
const { KeySet } = createFactories(require("../../../framework/content/components/xul/keyset"));
const { PopupSet } = createFactories(require("../../../framework/content/components/xul/popupset"));
const { CommandSet } = createFactories(require("../../../framework/content/components/xul/commandset"));
const { Splitter } = createFactories(require("../../../framework/content/components/splitter"));
const { Sidebar } = createFactories(require("../../../framework/content/components/sidebar"));

// Inspector
const { RulesPanel } = createFactories(require("./rules-panel"));
const { GenericPanel } = createFactories(require("./generic-panel"));

// Shortcuts
const vbox = createFactory("vbox");
const box = createFactory("box");
const tabs = createFactory("tabs");
const tabpanels = createFactory("tabpanels");
const { div, button } = React.DOM;

/**
 * Top level DevTools component
 */
var Inspector = React.createClass({
  displayName: "Inspector",

  render: function() {
    let keysets = this.props.keysets.map(keyset => KeySet({keyset: keyset}));
    let popupset = PopupSet({popupset: this.props.popupset});
    let commandset = CommandSet({commandset: this.props.commandset});

    let leftPanel =
      vbox({flex: "1", class: "devtools-main-content", is: ""},
        div({id: "inspector-toolbar", className: "devtools-toolbar"},
          button({id: "inspector-pane-toggle", className: "devtools-button" /* WHY IS THIS HIDDEN? */ })
        ),
        vbox({flex: "1", id: "markup-box", is: ""})
      );

//    let rightPanel =
//      div({id: "inspector-sidebar", handleCtrlTab: "false",
//        class: "devtools-sidebar-tabs", /*hidden: "true", */flex: "0", is: ""},
//        Sidebar({},
//          RulesPanel({className: "rules", key: "rules", title: "Rules"}),
//          GenericPanel({className: "rules", key: "rules", title: "Computed"}),
//          GenericPanel({className: "rules", key: "rules", title: "Fonts"}),
//          GenericPanel({className: "rules", key: "rules", title: "Box Model"}),
//          GenericPanel({className: "rules", key: "rules", title: "Animations"})
//        )
//      );

    let rightPanel =
      div({id: "inspector-sidebar", handleCtrlTab: "false",
        class: "devtools-sidebar-tabs", hidden: "true", flex: "0", is: ""},
        tabs({}),
        tabpanels({flex: "1", is: ""})
      );

    // Render the Inspector.
    return (
      div({id: "content"},
        keysets,
        popupset,
        commandset,
        box({flex: "1"},
          Splitter({
            mode: "vertical",
            min: 200,
            className: "devtools-side-splitter",
            leftPanel: leftPanel,
            rightPanel: rightPanel,
            innerBox: div({className: "innerBox"})
          })
        )
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
  Inspector: connect(mapStateToProps)(Inspector)
};
