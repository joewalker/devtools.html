/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Helpers for localization
 */
function internationalize(doc, strings, attributes = ["title", "placeholder"]) {
  let elements = cloneArray(doc.querySelectorAll(".translateAttr"));
  internationalizeElements(strings, elements, attributes);

  elements = cloneArray(doc.querySelectorAll(".translateText"));
  internationalizeElements(strings, elements);
}

function internationalizeElements(strings, elements, attributes) {
  for (var i=0; i<elements.length; i++) {
    var element = elements[i];

    // Remove l10n class, so that the label is not translated again later.
    let className = attributes ? "translateAttr" : "translateText";
    element.classList.remove(className);

    if (!attributes) {
      internationalizeElement(strings, element);
      continue;
    }

    for (var j=0; j<attributes.length; j++) {
      if (element.hasAttribute(attributes[j])) {
        internationalizeElement(strings, element, attributes[j]);
      }
    }
  }
};

function internationalizeElement(strings, element, attr) {
  var stringKey = attr ? element.getAttribute(attr) : element.textContent;
  let translated = strings.GetStringFromName(stringKey);
  if (!translated) {
    return;
  }

  if (attr) {
    element.setAttribute(attr, translated);
  } else {
    element.textContent = translated;
  }
}

function cloneArray(array) {
  var newArray = [], len = array.length;
  for (var i = 0; i < len; ++i) {
    newArray.push(array[i]);
  }
  return newArray;
};

exports.internationalize = internationalize;
