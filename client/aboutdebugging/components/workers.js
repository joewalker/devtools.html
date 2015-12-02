/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global React, TargetListComponent */

"use strict";

const { Ci } = require("devtools/sham/chrome");
const React = require("devtools/client/shared/vendor/react");
const { TargetListComponent } = require("devtools/client/aboutdebugging/components/target-list");
const { Services } = require("devtools/sham/services");

const Strings = Services.strings.createBundle(
  require("l10n/aboutdebugging.properties"));
const WorkerIcon = "/client/themes/images/debugging-workers.svg";

exports.WorkersComponent = React.createClass({
  displayName: "WorkersComponent",

  getInitialState() {
    return {
      workers: {
        service: [],
        shared: [],
        other: []
      }
    };
  },

  componentDidMount() {
    this.props.client.addListener("workerListChanged", this.update);
    this.update();
  },

  componentWillUnmount() {
    this.props.client.removeListener("workerListChanged", this.update);
  },

  render() {
    let client = this.props.client;
    let workers = this.state.workers;
    return React.createElement("div", { className: "inverted-icons" },
      React.createElement(TargetListComponent, {
        name: Strings.GetStringFromName("serviceWorkers"),
        targets: workers.service, client }),
      React.createElement(TargetListComponent, {
        name: Strings.GetStringFromName("sharedWorkers"),
        targets: workers.shared, client }),
      React.createElement(TargetListComponent, {
        name: Strings.GetStringFromName("otherWorkers"),
        targets: workers.other, client })
    );
  },

  update() {
    let client = this.props.client;
    let workers = this.getInitialState().workers;
    client.mainRoot.listWorkers(response => {
      let forms = response.workers;
      forms.forEach(form => {
        let worker = {
          name: form.url,
          icon: WorkerIcon,
          actorID: form.actor
        };
        switch (form.type) {
          case Ci.nsIWorkerDebugger.TYPE_SERVICE:
            worker.type = "serviceworker";
            workers.service.push(worker);
            break;
          case Ci.nsIWorkerDebugger.TYPE_SHARED:
            worker.type = "sharedworker";
            workers.shared.push(worker);
            break;
          default:
            worker.type = "worker";
            workers.other.push(worker);
        }
      });
      this.setState({ workers });
    });
  }
});
