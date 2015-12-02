/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global alert, BrowserToolboxProcess, gDevTools, React, TargetFactory,
   Toolbox */

"use strict";

const React = require("devtools/client/shared/vendor/react");
const { TargetFactory } = require("devtools/client/framework/target");
const { Toolbox } = require("devtools/client/framework/toolbox");
const { Services } = require("devtools/sham/services");

const { BrowserToolboxProcess } = require("devtools/client/framework/ToolboxProcess");
const { gDevTools } = require("devtools/client/framework/gDevTools");

const Strings = Services.strings.createBundle(
  require("l10n/aboutdebugging.properties"));

exports.TargetComponent = React.createClass({
  displayName: "TargetComponent",

  debug() {
    let client = this.props.client;
    let target = this.props.target;
    switch (target.type) {
      case "extension":
        BrowserToolboxProcess.init({ addonID: target.addonID });
        break;
      case "serviceworker":
        // Fall through.
      case "sharedworker":
        // Fall through.
      case "worker":
        let workerActor = this.props.target.actorID;
        client.attachWorker(workerActor, (response, workerClient) => {
          gDevTools.showToolbox(TargetFactory.forWorker(workerClient),
            "jsdebugger", Toolbox.HostType.WINDOW);
        });
        break;
      default:
        alert("Not implemented yet!");
    }
  },

  render() {
    let target = this.props.target;
    return React.createElement("div", { className: "target" },
      React.createElement("img", {
        className: "target-icon",
        src: target.icon }),
      React.createElement("div", { className: "target-details" },
        React.createElement("div", { className: "target-name" }, target.name),
        React.createElement("div", { className: "target-url" }, target.url)
      ),
      React.createElement("button", { onClick: this.debug },
        Strings.GetStringFromName("debug"))
    );
  },
});
