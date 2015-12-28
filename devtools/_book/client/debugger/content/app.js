const React = require('devtools/client/shared/vendor/react');
const ReactDOM = require('devtools/client/shared/vendor/react-dom');

const Panel = React.createFactory(require('./components/panel'));
const Box = React.createFactory(require('./components/box'));
const Editor = React.createFactory(require('./components/editor'));
const dom = React.DOM;

const App = React.createClass({
  getInitialState: function() {
    return { stateClosed: false };
  },

  componentDidMount: function() {
    setTimeout(() => {
      // this.setState({ stateClosed: true });
    }, 1000);
  },

  render: function() {
    return Box(
      { style: { flex: 1 } },
      Panel(null, Editor({ text: 'hello' })),
      Panel({ size: 300,
              closed: this.state.stateClosed },
            dom.div({ style: { backgroundColor: 'red' }}, 'hello'))
    );
  }
});

ReactDOM.render(
  React.createElement(App),
  document.getElementById('debugger-content')
)
