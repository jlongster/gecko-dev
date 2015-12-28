const React = require('devtools/client/shared/vendor/react');
const dom = React.DOM;

const Box = React.createClass({
  displayName: "Box",

  propTypes: {
    vertical: React.PropTypes.bool
  },

  render: function() {
    return dom.div({
      style: Object.assign({}, this.props.style, {
        display: 'flex',
        flexDirection: this.props.vertical ? 'column' : 'row'
      })
    }, this.props.children);
  }
});

module.exports = Box;
