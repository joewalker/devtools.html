/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { Cc, Ci, Cu } = require("devtools/sham/chrome");

function closeWindow(aClose, aPromptFunction)
{
//@line 28 "/builds/slave/m-cen-m64-ntly-000000000000000/build/src/toolkit/content/globalOverlay.js"
    if (typeof(aPromptFunction) == "function" && !aPromptFunction())
      return false;

  if (aClose) {
    window.close();
    return window.closed;
  }

  return true;
}

function canQuitApplication(aData)
{
  var os = Cc("@mozilla.org/observer-service;1")
                              .getService(Ci.nsIObserverService);
  if (!os) return true;

  try {
    var cancelQuit = Cc("@mozilla.org/supports-PRBool;1")
                              .createInstance(Ci.nsISupportsPRBool);
    os.notifyObservers(cancelQuit, "quit-application-requested", aData || null);

    // Something aborted the quit process.
    if (cancelQuit.data)
      return false;
  }
  catch (ex) { }
  return true;
}

function goQuitApplication()
{
  if (!canQuitApplication())
    return false;

  var appStartup = Cc('@mozilla.org/toolkit/app-startup;1').
                     getService(Ci.nsIAppStartup);

  appStartup.quit(Ci.nsIAppStartup.eAttemptQuit);
  return true;
}

//
// Command Updater functions
//
function goUpdateCommand(aCommand)
{
  try {
    var controller = top.document.commandDispatcher
                        .getControllerForCommand(aCommand);

    var enabled = false;
    if (controller)
      enabled = controller.isCommandEnabled(aCommand);

    goSetCommandEnabled(aCommand, enabled);
  }
  catch (e) {
    console.error("An error occurred updating the " +
                                 aCommand + " command: " + e);
  }
}

function goDoCommand(aCommand)
{
  try {
    var controller = top.document.commandDispatcher
                        .getControllerForCommand(aCommand);
    if (controller && controller.isCommandEnabled(aCommand))
      controller.doCommand(aCommand);
  }
  catch (e) {
    console.error("An error occurred executing the " +
                                 aCommand + " command: " + e);
  }
}


function goSetCommandEnabled(aID, aEnabled)
{
  var node = document.getElementById(aID);

  if (node) {
    if (aEnabled)
      node.removeAttribute("disabled");
    else
      node.setAttribute("disabled", "true");
  }
}

function goSetMenuValue(aCommand, aLabelAttribute)
{
  var commandNode = top.document.getElementById(aCommand);
  if (commandNode) {
    var label = commandNode.getAttribute(aLabelAttribute);
    if (label)
      commandNode.setAttribute("label", label);
  }
}

function goSetAccessKey(aCommand, aValueAttribute)
{
  var commandNode = top.document.getElementById(aCommand);
  if (commandNode) {
    var value = commandNode.getAttribute(aValueAttribute);
    if (value)
      commandNode.setAttribute("accesskey", value);
  }
}

// this function is used to inform all the controllers attached to a node that an event has occurred
// (e.g. the tree controllers need to be informed of blur events so that they can change some of the
// menu items back to their default values)
function goOnEvent(aNode, aEvent)
{
  var numControllers = aNode.controllers.getControllerCount();
  var controller;

  for (var controllerIndex = 0; controllerIndex < numControllers; controllerIndex++) {
    controller = aNode.controllers.getControllerAt(controllerIndex);
    if (controller)
      controller.onEvent(aEvent);
  }
}

function setTooltipText(aID, aTooltipText)
{
  var element = document.getElementById(aID);
  if (element)
    element.setAttribute("tooltiptext", aTooltipText);
}

this.__defineGetter__("NS_ASSERT", function() {
  delete this.NS_ASSERT;
  const { NS_ASSERT } = require("resource://gre/modules/debug.js");
  return this.NS_ASSERT = NS_ASSERT;
});
