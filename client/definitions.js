/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {Cc, Ci, Cu} = require("devtools/sham/chrome");

const { Services } = require("devtools/sham/services");

var osString = "Darwin";
var InspectorPanel = require("devtools/client/inspector/inspector-panel").InspectorPanel;
var WebConsolePanel = require("devtools/client/webconsole/panel").WebConsolePanel;
// loader.lazyGetter(this, "OptionsPanel", () => require("devtools/client/framework/toolbox-options").OptionsPanel);
// loader.lazyGetter(this, "WebConsolePanel", () => require("devtools/client/webconsole/panel").WebConsolePanel);

// Strings
const L10N = require("devtools/sham/l10n");

var toolboxStrings = new L10N(require("l10n/toolbox.properties"));
var webConsoleStrings = new L10N(require("l10n/webconsole.properties"));
var inspectorStrings = new L10N(require("l10n/inspector.properties"));

var Tools = {};
exports.Tools = Tools;

// Definitions
Tools.options = {
  id: "options",
  ordinal: 0,
  url: "chrome://devtools/content/framework/toolbox-options.xul",
  icon: "../themes/images/tool-options.svg",
  invertIconForLightTheme: true,
  bgTheme: "theme-body",
  label: l10n("options.label", toolboxStrings),
  iconOnly: true,
  panelLabel: l10n("options.panelLabel", toolboxStrings),
  tooltip: l10n("optionsButton.tooltip", toolboxStrings),
  inMenu: false,

  isTargetSupported: function(target) {
    return true;
  },

  build: function(iframeWindow, toolbox) {
    return new OptionsPanel(iframeWindow, toolbox);
  }
}

Tools.inspector = {
  id: "inspector",
  accesskey: l10n("inspector.accesskey", inspectorStrings),
  key: l10n("inspector.commandkey", inspectorStrings),
  ordinal: 1,
  modifiers: osString == "Darwin" ? "accel,alt" : "accel,shift",
  icon: "../themes/images/tool-inspector.svg",
  invertIconForLightTheme: true,
  url: "../inspector/inspector.html",
  label: l10n("inspector.label", inspectorStrings),
  panelLabel: l10n("inspector.panelLabel", inspectorStrings),
  get tooltip() {
    return l10n("inspector.tooltip2", inspectorStrings,
    ( osString == "Darwin" ? "Cmd+Opt+" : "Ctrl+Shift+" ) + this.key);
  },
  inMenu: true,
  commands: [
    "devtools/client/responsivedesign/resize-commands",
    "devtools/client/inspector/inspector-commands",
    "devtools/client/eyedropper/commands.js"
  ],

  preventClosingOnKey: true,
  onkey: function(panel) {
    panel.toolbox.highlighterUtils.togglePicker();
  },

  isTargetSupported: function(target) {
    return target.hasActor("inspector");
  },

  build: function(iframeWindow, toolbox) {
    return new InspectorPanel(iframeWindow, toolbox);
  }
};

Tools.webConsole = {
  id: "webconsole",
  key: l10n("cmd.commandkey", webConsoleStrings),
  accesskey: l10n("webConsoleCmd.accesskey", webConsoleStrings),
  modifiers: Services.appinfo.OS == "Darwin" ? "accel,alt" : "accel,shift",
  ordinal: 2,
  icon: "../themes/images/tool-webconsole.svg",
  invertIconForLightTheme: true,
  url: "../webconsole/webconsole.xhtml",
  label: l10n("ToolboxTabWebconsole.label", webConsoleStrings),
  menuLabel: l10n("MenuWebconsole.label", webConsoleStrings),
  panelLabel: l10n("ToolboxWebConsole.panelLabel", webConsoleStrings),
  get tooltip() {
    return l10n("ToolboxWebconsole.tooltip2", webConsoleStrings,
    ( osString == "Darwin" ? "Cmd+Opt+" : "Ctrl+Shift+" ) + this.key);
  },
  inMenu: true,
  commands: "devtools/client/webconsole/console-commands",

  preventClosingOnKey: true,
  onkey: function(panel, toolbox) {
    if (toolbox.splitConsole)
      return toolbox.focusConsoleInput();

    panel.focusInput();
  },

  isTargetSupported: function(target) {
    return true;
  },

  build: function(iframeWindow, toolbox) {
    return new WebConsolePanel(iframeWindow, toolbox);
  }
};

var defaultTools = [
  Tools.options,
  Tools.webConsole,
  Tools.inspector,
];

exports.defaultTools = defaultTools;

Tools.darkTheme = {
  id: "dark",
  label: l10n("options.darkTheme.label", toolboxStrings),
  ordinal: 1,
  stylesheets: ["../themes/dark-theme.css"],
  classList: ["theme-dark"],
};

Tools.lightTheme = {
  id: "light",
  label: l10n("options.lightTheme.label", toolboxStrings),
  ordinal: 2,
  stylesheets: ["../themes/light-theme.css"],
  classList: ["theme-light"],
};

exports.defaultThemes = [
  Tools.darkTheme,
  Tools.lightTheme,
];

/**
 * Lookup l10n string from a string bundle.
 *
 * @param {string} name
 *        The key to lookup.
 * @param {StringBundle} bundle
 *        The key to lookup.
 * @returns A localized version of the given key.
 */
function l10n(name, bundle, arg)
{
  try {
    return arg ? bundle.formatStringFromName(name, [arg], 1)
    : bundle.GetStringFromName(name);
  } catch (ex) {
    // Services.console.logStringMessage("Error reading '" + name + "'");
    // throw new Error("l10n error with " + name);
    return "Error reading string";
  }
}

function functionkey(shortkey)
{
  return shortkey.split("_")[1];
}
