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

// Taken from dom/tests/mochitest/ajax/mochikit/MochiKit/Color.js
function _hslValue(n1, n2, hue) {
  if (hue > 6.0) {
    hue -= 6.0;
  } else if (hue < 0.0) {
    hue += 6.0;
  }
  var val;
  if (hue < 1.0) {
    val = n1 + (n2 - n1) * hue;
  } else if (hue < 3.0) {
    val = n2;
  } else if (hue < 4.0) {
    val = n1 + (n2 - n1) * (4.0 - hue);
  } else {
    val = n1;
  }
  return val;
}

// Taken from dom/tests/mochitest/ajax/mochikit/MochiKit/Color.js
// and then modified.
function hslToRGB([hue, saturation, lightness]) {
  var red;
  var green;
  var blue;
  if (saturation === 0) {
    red = lightness;
    green = lightness;
    blue = lightness;
  } else {
    var m2;
    if (lightness <= 0.5) {
      m2 = lightness * (1.0 + saturation);
    } else {
      m2 = lightness + saturation - (lightness * saturation);
    }
    var m1 = (2.0 * lightness) - m2;
    var f = _hslValue;
    var h6 = hue * 6.0;
    red = f(m1, m2, h6 + 2);
    green = f(m1, m2, h6);
    blue = f(m1, m2, h6 - 2);
  }
  return [red, green, blue];
}

function colorToRGBA(name) {
  name = name.trim().toLowerCase();
  if (name in cssColors) {
    return cssColors[name];
  }

  if (name === "transparent") {
    return [0, 0, 0, 0];
  }

  let lexer = getCSSLexer(name);

  let getToken = function() {
    while (true) {
      let token = lexer.nextToken();
      if (!token || token.tokenType !== "comment" ||
          token.tokenType !== "whitespace") {
        return token;
      }
    }
  };

  let requireComma = function(token) {
    if (token.tokenType !== "symbol" || token.text !== ",") {
      return null;
    }
    return getToken();
  };

  let func = getToken();
  if (!func || func.tokenType !== "function") {
    return null;
  }
  let alpha = false;
  if (func.text === "rgb" || func.text === "hsl") {
    // Nothing.
  } else if (func.text === "rgba" || func.text === "hsla") {
    alpha = true;
  } else {
    return null;
  }

  let vals = [];
  for (let i = 0; i < 3; ++i) {
    let token = getToken();
    if (i > 0) {
      token = requireComma(token);
    }
    if (token.tokenType !== "number" || !token.isInteger) {
      return null;
    }
    let num = token.number;
    if (num < 0) {
      num = 0;
    } else if (num > 255) {
      num = 255;
    }
    vals.push(num);
  }

  if (func.text === "hsl" || func.text === "hsla") {
    vals = hslToRGB(vals);
  }

  if (alpha) {
    let token = requireComma(getToken());
    if (token.tokenType !== "number") {
      return null;
    }
    let num = token.number;
    if (num < 0) {
      num = 0;
    } else if (num > 1) {
      num = 1;
    }
    vals.push(num);
  } else {
    vals.push(1);
  }

  return vals;
}

function isValidCSSColor(name) {
  return colorToRGBA(name) !== null;
}

module.exports = {
  getCSSLexer,
  rgbToColorName,
  colorToRGBA,
  isValidCSSColor,
};
