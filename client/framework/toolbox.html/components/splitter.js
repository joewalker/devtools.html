/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// ReactJS
const React = require("react");

// Stylesheets
const css = require("./splitter.css");

// Core
const { Events } = require("./core/events");

// Constants
const { div } = React.DOM;

/**
 * @template This template represents a simple splitter that
 * is used to divide the side panel with packet details.
 * It now supports 'vertical' mode only and 'horizontal' mode
 * should be appended as needed
 */
var Splitter = React.createClass({
/** @lends Splitter */

  displayName: "Splitter",

  componentDidMount: function() {
    var splitter = this.refs.splitter;

    this.resizer = new Tracker(splitter, {
      onDragStart: this.onDragStart,
      onDragOver: this.onDragOver,
      onDrop: this.onDrop
    });
  },

  componentWillUnmount: function() {
    if (this.resizer) {
      this.resizer.destroy();
      this.resizer = null;
    }
  },

  // Resizing

  onDragStart: function(/*tracker*/) {
    var splitter = this.refs.splitter;
    var body = splitter.ownerDocument.body;
    body.setAttribute("resizing", "true");

    var rightPanel = this.refs.rightPanel;
    this.rightWidth = rightPanel.clientWidth;
  },

  onDragOver: function(newPos/*, tracker*/) {
    var rightPanel = this.refs.rightPanel;
    var newWidth = (this.rightWidth - newPos.x);
    if (newWidth < this.props.min) {
      return;
    }

    rightPanel.style.width = newWidth + "px";
  },

  onDrop: function(/*tracker*/) {
    var splitter = this.refs.splitter;
    var body = splitter.ownerDocument.body;
    body.removeAttribute("resizing");
  },

  // Rendering

  render: function() {
    var leftPanel = this.props.leftPanel;
    var rightPanel = this.props.rightPanel;
    var splitterClassNames = ["splitter", this.props.mode];

    return (
      div({className: "splitterBox", ref: "splitterBox"},
        div({className: "leftPanel", ref: "leftPanel"},
          leftPanel
        ),
        div({className: splitterClassNames.join(" "), ref: "splitter"},
          this.props.innerBox
        ),
        div({className: "rightPanel", ref: "rightPanel"},
          rightPanel
        )
      )
    );
  }
});

/**
 * Helper object for drag-and-drop. It's used e.g. by the {@Splitter}
 * template. This object registers mouse event listeners and executes
 * provided callbacks - typically an object/component that implements
 * drag and drop features.
 */
function Tracker(handle, callbacks) {
  this.element = handle;
  this.handle = handle;
  this.callbacks = callbacks;

  this.cursorStartPos = null;
  this.cursorLastPos = null;
  //this.elementStartPos = null;
  this.dragging = false;

  // Start listening
  this.onDragStart = this.onDragStart.bind(this);
  this.onDragOver = this.onDragOver.bind(this);
  this.onDrop = this.onDrop.bind( this);

  this.element.addEventListener("mousedown", this.onDragStart, false);
  this.active = true;
}

Tracker.prototype =
/** @lends Tracker */
{
  onDragStart: function(event) {
    if (this.dragging) {
      return;
    }

    if (this.callbacks.onDragStart) {
      this.callbacks.onDragStart(this);
    }

    this.dragging = true;
    this.cursorStartPos = absoluteCursorPosition(event);
    this.cursorLastPos = this.cursorStartPos;
    //this.elementStartPos = new Position(
    //    parseInt(this.element.style.left),
    //    parseInt(this.element.style.top));

    this.element.ownerDocument.addEventListener("mousemove",
      this.onDragOver, false);

    this.element.ownerDocument.addEventListener("mouseup",
      this.onDrop, false);

    Events.cancelEvent(event);
  },

  onDragOver: function(event) {
    if (!this.dragging) {
      return;
    }

    Events.cancelEvent(event);

    var newPos = absoluteCursorPosition(event);
    //newPos = newPos.Add(this.elementStartPos);
    newPos = newPos.Subtract(this.cursorStartPos);
    //newPos = newPos.Bound(lowerBound, upperBound);
    //newPos.Apply(this.element);

    // Only fire event if the position has beeb changed.
    if (this.cursorLastPos.x == newPos.x && this.cursorLastPos.y == newPos.y) {
      return;
    }

    this.cursorLastPos = newPos;

    if (this.callbacks.onDragOver != null) {
      this.callbacks.onDragOver(newPos, this);
    }
  },

  onDrop: function(event) {
    if (!this.dragging) {
      return;
    }

    Events.cancelEvent(event);

    this.dragStop();
  },

  dragStop: function() {
    if (!this.dragging) {
      return;
    }

    this.element.ownerDocument.removeEventListener("mousemove",
      this.onDragOver, false);
    this.element.ownerDocument.removeEventListener("mouseup",
      this.onDrop, false);

    this.cursorStartPos = null;
    this.cursorLastPos = null;
    //this.elementStartPos = null;

    if (this.callbacks.onDrop != null) {
      this.callbacks.onDrop(this);
    }

    this.dragging = false;
  },

  destroy: function() {
    this.element.removeEventListener("mousedown",
      this.onDragStart, false);

    this.active = false;

    if (this.dragging) {
      this.dragStop();
    }
  }
};

/**
 * This object is represents mouse position and provides
 * related API for its manipulation.
 */
function Position(x, y)
/** @lends Position */
{
  this.x = x;
  this.y = y;

  this.Add = function(val) {
    var newPos = new Position(this.x, this.y);
    if (val != null) {
      if (!isNaN(val.x)) {
        newPos.x += val.x;
      }

      if (!isNaN(val.y)) {
        newPos.y += val.y;
      }
    }
    return newPos;
  };

  this.Subtract = function(val) {
    var newPos = new Position(this.x, this.y);
    if (val != null) {
      if (!isNaN(val.x)) {
        newPos.x -= val.x;
      }

      if (!isNaN(val.y)) {
        newPos.y -= val.y;
      }
    }
    return newPos;
  };

  this.Bound = function(lower, upper) {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  };

  this.Check = function() {
    var newPos = new Position(this.x, this.y);
    if (isNaN(newPos.x)) {
      newPos.x = 0;
    }

    if (isNaN(newPos.y)) {
      newPos.y = 0;
    }

    return newPos;
  };

  this.Apply = function(element) {
    if (typeof element == "string") {
      element = document.getElementById(element);
    }

    if (!element) {
      return;
    }

    if (!isNaN(this.x)) {
      element.style.left = this.x + "px";
    }

    if (!isNaN(this.y)) {
      element.style.top = this.y + "px";
    }
  };
}

// Helpers

function absoluteCursorPosition(e) {
  if (isNaN(window.scrollX)) {
    return new Position(e.clientX +
      document.documentElement.scrollLeft +
      document.body.scrollLeft, e.clientY +
      document.documentElement.scrollTop +
      document.body.scrollTop);
  }
  else {
    return new Position(e.clientX + window.scrollX,
      e.clientY + window.scrollY);
  }
}

// Exports from this module
module.exports = {
  Splitter: Splitter
}
