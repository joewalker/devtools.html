/*
 * A sham for https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
 */

module.exports = {
  Cc: {},
  Ci: {},
  Cu: {
    reportError: (msg) => console.error(msg),
  },
  Cr: {},
  components: {

  }
};
