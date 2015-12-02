const React = require("react");
const queries = require("../queries");
const sourcesActions = require("../actions/sources");

const Toolbar = React.createFactory(require('./Toolbar'));
const Sources = React.createFactory(require('./Sources'));
const Editor = React.createFactory(require('./Editor'));
const dom = React.DOM;

const Debugger = React.createClass({
  render: function() {
    return dom.div(
      { className: 'vbox',
        style: {
        width: '100%',
        height: '100%'
      }},
      Toolbar(),
      dom.div(
        { className: 'hbox',
          style: { flex: 1 }},
        Sources(),
        Editor({
          content: 'hola'
        })
      )
    );
  }
});

module.exports = Debugger;
