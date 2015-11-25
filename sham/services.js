/*
 * A sham for https://dxr.mozilla.org/mozilla-central/source/toolkit/modules/Services.jsm
 */

const Services = {
  strings: {
    createBundle: name => {
      // TODO: implement
      return  {
        GetStringFromName: () => { return ""; },
        formatStringFromName: () => { return ""; }
      }
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

Services.tm = {
  currentThread: {
    dispatch: (cb) => {
      setImmediate(cb);
    }
  },
  mainThread: {
    dispatch: (cb) => {
      setImmediate(cb);
    }
  }
};

module.exports.Services = Services;
