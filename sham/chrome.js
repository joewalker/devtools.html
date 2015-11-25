/*
 * A sham for https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
 */

var { CSSLexer } = require("devtools/sham/parse-css");

var ourServices = {
  inIDOMUtils: {
    getCSSLexer: function(text) {
      return new CSSLexer(text);
    },
  },
};

module.exports = {
  Cc: name => {
    console.log('Sham for', name);
    return {
      getService: (name) => ourServices[name]
    };
  },
  Ci: {
    nsIFocusManager: {
      MOVEFOCUS_BACKWARD: 2,
      MOVEFOCUS_FORWARD: 1,
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
