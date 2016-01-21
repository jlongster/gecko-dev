const React = require("devtools/client/shared/vendor/react");
const loadCSS = require("devtools/client/shared/vendor/load-css");
const { DOM: dom } = React;
const { div } = dom;

const DOMBreakpoints = React.createClass({
  render: function() {
    return div({ className: "dom-breakpoints" }, "No DOM Breakpoints");
  }
});

module.exports = DOMBreakpoints;
