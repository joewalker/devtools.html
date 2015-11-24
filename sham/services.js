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
  }
};

exports.Services = Services;
