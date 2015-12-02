const React = require("react");
const { bindActionCreators } = require("redux");
const { connect } = require("react-redux");
const queries = require("../queries");
const sourcesActions = require("../actions/sources");
const dom = React.DOM;

const Sources = React.createClass({
  render: function() {
    const sources = this.props.sources;

    return dom.div(
      { className: "sources",
        style: { flex: "0 0 300px",
                 overflow: "auto" } },
      dom.h4(null, "Sources"),
      dom.ul(
        null,
        Object.keys(sources).map(k => {
          const source = sources[k];

          if(source.url) {
            return dom.li({
              key: source.actor,
              onClick: () => this.props.selectSource(source),
              className: this.props.selectedSource === source ? 'selected' : '',
            }, source.url);
          }
        })
      )
    );
  }
});

module.exports = connect(
  state => ({
    selectedSource: queries.getSelectedSource(state),
    sources: queries.getSources(state)
  }),
  dispatch => bindActionCreators(sourcesActions, dispatch)
)(Sources);
