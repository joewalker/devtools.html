/*
 * A sham for features of `sdk/clipboard` and `nsIClipboardHelper`
 */

// Store it as a var for now
var clipboard = "";

module.exports = {
  get: () => clipboard,
  copy: (str) => clipboard = str,
  currentFlavors: ["text/html"],
};
