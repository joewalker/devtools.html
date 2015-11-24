/*
 * A sham for https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
 */

module.exports = {
  Cc: name => {
    console.log('Sham for', name);
    return {
      getService: () => {}
    };
  },
  Ci: {
    nsIFocusManager: {
      MOVEFOCUS_BACKWARD: 2,
      MOVEFOCUS_FORWARD: 1,

    }
  },
  Cu: {
    reportError: (msg) => console.error(msg),
  },
  Cr: {},
  components: {

  }
};
