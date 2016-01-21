const React = require("devtools/client/shared/vendor/react");
const loadCSS = require("devtools/client/shared/vendor/load-css");
const { DOM: dom } = React;
const { div } = dom;

loadCSS(require.resolve("./accordion.css"));

const Accordion = React.createClass({
  getInitialState: function() {
    return { opened: this.props.items.map(item => item.opened) };
  },

  handleHeaderClick: function(i) {
    const opened = [...this.state.opened];
    opened[i] = !opened[i];
    this.setState({ opened });
  },

  render: function() {
    const { opened } = this.state;
    return div(
      { className: "accordion" },
      this.props.items.map((item, i) => {
        return div(
          { className: opened[i] ? "opened" : "" },
          div({ className: "_header",
                onClick: () => this.handleHeaderClick(i) }, item.header),
          div({ className: "_content",
                style: { display: opened[i] ? "block" : "none" }},
              React.createElement(item.component))
        )
      })
    );
  }
});

module.exports = Accordion;
