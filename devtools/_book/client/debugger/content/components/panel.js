const React = require('devtools/client/shared/vendor/react');
const { DOM: dom, PropTypes } = React.DOM;

const Panel = React.createClass({
  displayName: "Panel",

  propTypes: {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shrink: PropTypes.bool,
    closed: PropTypes.bool
  },

  render: function() {
    const { size, shrink, closed } = this.props;
    if(this.props.children.length !== undefined) {
      throw new Error("Panel should be passed a single child element");
    }

    let flexProp;
    if (size) {
      flexProp = '0 0 ' +
        (typeof size === "string" ? size : (size + 'px'));
    } else if (shrink) {
      flexProp = 0;
    } else {
      flexProp = 1;
    }

    if(closed) {
      flexProp = '0 0 0px';
    }

    const child = this.props.children;
    return React.cloneElement(child, {
      style: Object.assign({}, {
        flex: flexProp,
        transition: 'flex .5s'
      }, child.props.style)
    });
  }
});

module.exports = Panel;
