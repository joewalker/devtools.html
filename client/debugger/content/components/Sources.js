const React = require("react");
const { bindActionCreators } = require("redux");
const { connect } = require("react-redux");
const { parse: parseURL } = require("url");
const queries = require("../queries");
const sourcesActions = require("../actions/sources");
const dom = React.DOM;

const Sources = React.createClass({
  groupSources: function(sources) {
    const groups = {};
    Object.keys(sources).forEach(k => {
      const source = sources[k];
      if(!source.url) {
        return;
      }
      const location = parseURL(source.url);

      if(!groups[location.host]) {
        groups[location.host] = [];
      }
      let label;
      if(location.pathname !== '/') {
        const paths = location.pathname.split('/');
        label = paths[paths.length - 1];
      }
      else {
        label = location.pathname;
      }
      groups[location.host].push({ source, label });
    });
    return groups;
  },

  render: function() {
    const sources = this.props.sources;
    const groups = this.groupSources(sources);

    return dom.div(
      { className: "sources",
        style: { flex: "0 0 300px",
                 overflow: "auto" } },
      dom.h4(null, "Sources"),
      Object.keys(groups).map(host => {
        return dom.div(
          null,
          dom.div({ className: 'host' }, host),
          dom.ul(
            null,
            groups[host].map(({ label, source }) => {
              return dom.li({
                key: source.actor,
                onClick: () => this.props.selectSource(source),
                className: this.props.selectedSource === source ? 'selected' : '',
              }, label)
            })
          )
        )
      })
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
