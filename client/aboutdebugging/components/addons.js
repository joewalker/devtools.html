/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global AddonManager, React, TargetListComponent */

"use strict";

const React = require("devtools/client/shared/vendor/react");
const { TargetListComponent } = require("devtools/client/aboutdebugging/components/target-list");
const { Services } = require("devtools/sham/services");

const { AddonManager } = require("devtools/sham/addonmanager");

const ExtensionIcon = "chrome://mozapps/skin/extensions/extensionGeneric.svg";
const Strings = Services.strings.createBundle(
  "chrome://devtools/locale/aboutdebugging.properties");

exports.AddonsComponent = React.createClass({
  displayName: "AddonsComponent",

  getInitialState() {
    return {
      extensions: []
    };
  },

  componentDidMount() {
    AddonManager.addAddonListener(this);
    this.update();
  },

  componentWillUnmount() {
    AddonManager.removeAddonListener(this);
  },

  render() {
    let client = this.props.client;
    let targets = this.state.extensions;
    let name = Strings.GetStringFromName("extensions");
    return React.createElement("div", null,
      React.createElement(TargetListComponent, { name, targets, client })
    );
  },

  update() {
    AddonManager.getAllAddons(addons => {
      let extensions = addons.filter(addon => addon.isDebuggable).map(addon => {
        return {
          name: addon.name,
          icon: addon.iconURL || ExtensionIcon,
          type: addon.type,
          addonID: addon.id
        };
      });
      this.setState({ extensions });
    });
  },

  onInstalled() {
    this.update();
  },

  onUninstalled() {
    this.update();
  },

  onEnabled() {
    this.update();
  },

  onDisabled() {
    this.update();
  },
});
