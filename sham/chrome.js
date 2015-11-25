/*
 * A sham for https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
 */

var inDOMUtils = require("devtools/sham/inDOMUtils");

var ourServices = {
  inIDOMUtils: inDOMUtils,
};

module.exports = {
  Cc: name => {
    console.log('Sham for', name);
    return {
      getService: (name) => ourServices[name]
    };
  },
  Ci: {
    nsIThread: {
      "DISPATCH_NORMAL":0,
      "DISPATCH_SYNC":1
    },
    nsIDOMNode: HTMLElement,
    nsIFocusManager: {
      MOVEFOCUS_BACKWARD: 2,
      MOVEFOCUS_FORWARD: 1,
    },
    nsIDOMKeyEvent: {

    },
    inIDOMUtils: "inIDOMUtils",
  },
  Cu: {
    reportError: (msg) => console.error(msg),
    callFunctionWithAsyncStack: fn => fn(),
  },
  Cr: {},
  components: {
    isSuccessCode: () => (returnCode & 0x80000000) === 0,
  }
};
