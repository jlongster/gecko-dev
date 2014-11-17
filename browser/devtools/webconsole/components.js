const dom = React.DOM;
const { div, ul, li } = dom;

const OutputElement = React.createFactory(React.createClass({
  render: function() {
    return div(null, 'hello');
  }
}));
