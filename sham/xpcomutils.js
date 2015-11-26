/*
 * A sham for https://dxr.mozilla.org/mozilla-central/source/js/xpconnect/loader/XPCOMUtils.jsm
 */

const XPCOMUtils = {
  defineLazyGetter: loader.lazyGetter,
  defineLazyImporter: loader.lazyImporter,
  defineLazyServiceGetter: loader.lazyServiceGetter,
  generateQI: function() {},
};

exports.XPCOMUtils = XPCOMUtils;
