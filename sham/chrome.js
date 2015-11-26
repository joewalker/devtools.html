/*
 * A sham for https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
 */

var { inDOMUtils } = require("devtools/sham/inDOMUtils");

var ourServices = {
  inIDOMUtils: inDOMUtils,
  nsIClipboardHelper: {
    copyString: () => {}
  },
  nsIXULChromeRegistry: {
    isLocaleRTL: () => {return false;}
  },
  nsIDOMParser: {

  },
};

module.exports = {
  Cc: name => {
    console.log('Cc sham for', name);
    return {
      getService: (name) => ourServices[name],
      createInstance: (iface) => ourServices[iface],
    };
  },
  CC: (name, iface, method) => {
    console.log('CC sham for', name, iface, method);
    return {
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
    nsIClipboardHelper: "nsIClipboardHelper",
    nsIXULChromeRegistry: "nsIXULChromeRegistry",
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
