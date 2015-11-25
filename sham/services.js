/*
 * A sham for https://dxr.mozilla.org/mozilla-central/source/toolkit/modules/Services.jsm
 */

const Services = {
  strings: {
    createBundle: name => {
      // TODO: implement
    }
  },
  appinfo: {
    OS: 'Darwin', // Probably
  },
  telemetry: {
    getHistogramById() {
      return {
        add() {}
      };
    },
  },
};

Services.obs = {
  addObserver: () => {},
  removeObserver: () => {},
}
Services.prefs = require("devtools/sham/services/prefs");

module.exports.Services = Services;
