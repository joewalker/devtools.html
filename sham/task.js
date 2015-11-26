/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80 filetype=javascript: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const promise = require("devtools/sham/promise");

/**
 * This object provides the public module functions.
 */
const Task = {
  /**
   * Creates and starts a new task.
   * @param task A generator function
   * @return A promise, resolved when the task terminates
   */
  spawn: function(task, scope) {
    return new Promise(function(resolve, reject) {
      const iterator = task.call(scope);

      const callNext = lastValue => {
        const iteration = iterator.next(lastValue);
        Promise.resolve(iteration.value)
               .then(value => (iteration.done ? resolve : callNext)(value))
               .catch(error => {
                 reject(error);
                 iterator.throw(error);
               });
      };

      callNext(undefined);
    });
  },
};

exports.Task = Task;
