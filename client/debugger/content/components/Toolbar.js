const React = require("react");
const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const sourcesActions = require("../actions/sources");
const queries = require("../queries");
const dom = React.DOM;

function resume() {
  gThreadClient.resume();
}

function pause() {
  gThreadClient.interrupt();
}

function stepIn() {
  gThreadClient.stepIn();
}

function stepOver() {
  gThreadClient.stepOver();
}

function stepOut() {
  gThreadClient.stepOut();
}

const Toolbar = React.createClass({
  componentDidMount: function() {
    gThreadClient.addListener("paused", () => {
      this.forceUpdate();
    });

    gThreadClient.addListener("resumed", () => {
      this.forceUpdate();
    });
  },

  render: function() {
    const isPaused = gThreadClient.state === "paused";
    const clearEditor = func => {
      return () => {
        this.props.selectSource(this.props.selectedSource);
        func();
      }
    };

    return dom.div(
      { className: 'toolbar',
        style: { flex: '0 25px' } },
      isPaused ?
        dom.button({ key: "resume",
                     className: "devtools-button resume",
                     checked: true,
                     onClick: clearEditor(resume) }) :
        dom.button({ key: "pause",
                     className: "devtools-button pause",
                     onClick: clearEditor(pause) }),
      dom.button({ className: "devtools-button stepIn",
                   onClick: clearEditor(stepIn) }),
      dom.button({ className: "devtools-button stepOver",
                   onClick: clearEditor(stepOver) }),
      dom.button({ className: "devtools-button stepOut",
                   onClick: clearEditor(stepOut) })
    )
  }
});

module.exports = connect(
  state => ({ selectedSource: queries.getSelectedSource(state) }),
  dispatch => bindActionCreators(
    { selectSource: sourcesActions.selectSource },
    dispatch
  )
)(Toolbar);
