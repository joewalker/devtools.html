/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Dependencies
const React = require("react");

/**
 * Create React factories for given arguments.
 * Example:
 *   const { Component } = createFactories(require("./component"));
 */
function createFactories(args) {
  var result = {};
  for (var p in args) {
    result[p] = React.createFactory(args[p]);
  }
  return result;
}

/**
 * Example:
 *  const box = createFactory("box");
 */
function createFactory(type) {
  return React.createElement.bind(null, type);
}

// Exports from this module
module.exports = {
  createFactories: createFactories,
  createFactory: createFactory
};
