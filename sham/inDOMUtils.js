// A sham for inDOMUtils.

"use strict";

var { CSSLexer } = require("devtools/sham/parse-css");
var { cssColors } = require("devtools/sham/css-color-db");

var cssRGBMap;

function getCSSLexer(text) {
  return new CSSLexer(text);
}

function rgbToColorName(r, g, b) {
  if (!cssRGBMap) {
    cssRGBMap = new Map();
    for (let name in cssColors) {
      cssRGBMap.set(JSON.stringify(cssColors[name]), name);
    }
  }
  let value = cssRGBMap.get(JSON.stringify([r, g, b]));
  if (!value) {
    throw new Error("no such color");
  }
  return value;
}

module.exports = {
  getCSSLexer,
  rgbToColorName,
};
