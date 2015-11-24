/*
 * A sham for https://dxr.mozilla.org/mozilla-central/source/js/xpconnect/loader/XPCOMUtils.jsm
 */

const XPCOMUtils = {
  defineLazyGetter: function(scope, name, getter) {
    let cache;
    let cached = false;
    Object.defineProperty(scope, name, {
      get: function() {
        if (cached) {
          return cache;
        }
        cache = getter();
        cached = true;
        return cache;
      },
    });
  }
};

exports.XPCOMUtils = XPCOMUtils;
