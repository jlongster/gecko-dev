const React = require('devtools/client/shared/vendor/react');
const ReactDOM = require('devtools/client/shared/vendor/react-dom');
const { Provider } = require('devtools/client/shared/vendor/react-redux');
const Accordion = React.createFactory(require('./components/accordion'));

const Breakpoints = React.createFactory(require('./components/breakpoints'));
const DOMBreakpoints = React.createFactory(require('./components/dom-breakpoints'));

function reactEntryPoint(store) {
  const tree = Accordion({
    items: [
      { header: "Breakpoints",
        component: Breakpoints,
        opened: true },
      { header: "DOM Breakpoints",
        component: DOMBreakpoints }
    ]
  });

  const pane = document.getElementById('instruments-pane');
  const mountNode = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
  pane.appendChild(mountNode);

  ReactDOM.render(
    React.createElement(Provider, { store }, tree),
    // The entry point right now is just the right sidebar
    mountNode
  );
}

module.exports = reactEntryPoint;
