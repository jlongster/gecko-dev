const React = require("devtools/client/shared/vendor/react");
const loadCSS = require("devtools/client/shared/vendor/load-css");
const { connect } = require("devtools/client/shared/vendor/react-redux");
const { getBreakpoints } = require("../queries");
const { DOM: dom } = React;
const { div } = dom;

const Breakpoints = React.createClass({
  render: function() {
    const { breakpoints } = this.props;

    if(breakpoints.length === 0) {
      return div(null, "No Breakpoints");
    }
    return dom.ul(
      { className: "breakpoints" },
      this.props.breakpoints.map(bp => {
        return dom.li(null, "Line: " + bp.location.line);
      })
    );
  }
});

module.exports = connect(
  state => ({ breakpoints: getBreakpoints(state) })
)(Breakpoints);
