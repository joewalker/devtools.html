const React = require("react");
const ReactDOM = require("react-dom");
const { bindActionCreators } = require("redux");
const { connect } = require("react-redux");
const queries = require("../queries");
const breakpointActions = require("../actions/breakpoints");
const DevToolsEditor = require("devtools/client/sourceeditor/editor");
const DebuggerExtensions = require("devtools/client/sourceeditor/debugger");
const dom = React.DOM;

const EditorBreakpoint = React.createClass({
  componentDidMount: function() {
    if(this.props.editor) {
      this.props.editor.addBreakpoint(this.props.bp.location.line - 1);
    }
  },

  componentWillUnmount: function() {
    if(this.props.editor) {
      this.props.editor.removeBreakpoint(this.props.bp.location.line - 1);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(this.props.editor) {
      this.props.editor.removeBreakpoint(this.props.bp.location.line - 1);
      this.props.editor.addBreakpoint(nextProps.bp.location.line - 1);
    }
  },

  render: function() {
    return null;
  }
});

const Editor = React.createClass({
  componentDidMount: function() {
    this._editor = new DevToolsEditor({
      mode: DevToolsEditor.modes.js,
      readOnly: true,
      lineNumbers: true,
      showAnnotationRuler: true,
      gutters: ["breakpoints"],
      enableCodeFolding: false
    });

    console.log('creating & appending');

    this._editor.appendTo(ReactDOM.findDOMNode(this)).then(() => {
      console.log('appended2s');
      this._editor.extend(DebuggerExtensions);
      this.update();
    });

    this._editor.on("gutterClick", (ev, line, button) => {
      const source = this.props.selectedSource;
      const location = { actor: source.actor, line: line + 1 };
      if(queries.getBreakpoint(this.props.state, location)) {
        this.props.removeBreakpoint(location);
      }
      else {
        this.props.addBreakpoint(location);
      }
    });
  },

  componentDidUpdate: function() {
    this.update();
  },

  shouldComponentUpdate: function(nextProps) {
    let isEqual = true;
    Object.keys(this.props).forEach(name => {
      if(this.props[name] !== nextProps[name]) {
        isEqual = false;
      }
    });
    return !isEqual;
  },

  update: function() {
    if(!this._editor || !this._editor.isReady) {
      return;
    }

    const sourceText = this.props.sourceText;
    this._editor.removeAllMarkers("breakpoints");

    if(!sourceText) {
      this._editor.setText('Choose a source, wise one.');
      this._currentText = null;
    }
    else if(sourceText.loading) {
      this._editor.setText('Loading...');
      this._currentText = null;
    }
    else {
      if(this._currentText !== sourceText) {
        this._editor.setText(sourceText.text);
        this._currentText = sourceText;
      }

      this.props.breakpoints.map(bp => {
        if(this.props.selectedSource &&
           this.props.selectedSource.actor === bp.location.actor) {
          this._editor.addBreakpoint(bp.location.line - 1);
        }
      });

      const opts = this.props.selectedSourceOpts || {};
      if(opts.line) {
        this._editor.setDebugLocation(opts.line - 1);
      }
      else {
        this._editor.clearDebugLocation();
      }

    }
  },

  render: function() {
    return dom.div(
      { style: { flex: 1,
                 display: 'flex' }
      }
    );
  }
});

module.exports = connect(
  state => {
    const selectedSource = queries.getSelectedSource(state);
    return {
      selectedSource: selectedSource,
      selectedSourceOpts: queries.getSelectedSourceOpts(state),
      sourceText: selectedSource ? queries.getSourceText(state, selectedSource.actor) : null,
      breakpoints: queries.getBreakpoints(state),
      state: state
    }
  },
  dispatch => bindActionCreators(breakpointActions, dispatch)
)(Editor);
