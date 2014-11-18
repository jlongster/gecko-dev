Components.utils.import("resource:///modules/devtools/VariablesView.jsm");
const dom = React.DOM;
const { div, span, ul, li } = dom;

function Element(obj) {
  return React.createFactory(React.createClass(obj));
}

function merge(obj1, obj2) {
  var res = {};
  Object.keys(obj1).forEach(k => {
    res[k] = obj1[k];
  });
  Object.keys(obj2).forEach(k => {
    res[k] = obj2[k];
  });
  return res;
}

const Message = Element({
  render: function() {
    return dom.div(
      { className: 'message' },
      dom.span({ className: 'message-body-wrapper message-body devtools-monospace' },
               this.props.text)
    );
  }
});

const ConsoleMessage = Element({
  classNames: {
    "number": "cm-number",
    "longstring": "console-string",
    "string": "console-string",
    "regexp": "cm-string-2",
    "boolean": "cm-atom",
    "-infinity": "cm-atom",
    "infinity": "cm-atom",
    "null": "cm-atom",
    "undefined": "cm-comment",
    "symbol": "cm-atom"
  },

  componentDidMount: function() {
    this.componentDidUpdate();
  },

  componentDidUpdate: function() {
    this.getDOMNode().setAttribute('category', this.props.category);
    this.getDOMNode().setAttribute('severity', this.props.severity);
  },

  render: function() {
    let pieces = this.props.pieces.map(p => {
      if(p.multipart) {
        return p.values.map(value => {
          if(typeof value === 'string') {
            return span({ className: 'console-string' }, value);
          }
          else if(value.url) {
            return dom.a({ className: 'url',
                           href: value.url },
                         value.url);
          }
        });
      }
      else {
        return span({ className: this.classNames[p.type] },
                    VariablesView.getString(p.value));
      }
    });

    return dom.div(
      { className: 'message cm-s-mozilla',
        style: this.props.style },
      span({ className: 'indent',
             style: { width: 0,
                      '-moz-margin-start': 0}}),
      span({ className: 'icon' }),
      span(
        { className: 'message-body-wrapper' },
        span(
          { className: 'message-flex-body' },
          span({ className: 'message-body devtools-monospace' },
               pieces)
        )
      )
    );
  }
});

const OutputElement = Element({
  getInitialState: function() {
    return { containerHeight: null };
  },

  componentDidMount: function() {
    let node = document.getElementById('output-wrapper');

    setTimeout(() => {
      let rect = node.getBoundingClientRect();
      this.setState({ containerHeight: rect.height });
    }, 0);
  },

  componentWillUpdate: function() {
    var el = document.getElementById('output-wrapper');
    if(this.state.containerHeight) {
      this.shouldScrollBottom = (el.scrollTop + this.state.containerHeight) >= el.scrollHeight;
    }
  },

  componentDidUpdate: function(prevProps) {
    if(this.shouldScrollBottom) {
      var el = document.getElementById('output-wrapper');
      el.scrollTop = el.scrollHeight;
    }
  },

  render: function() {
    let messages = [];

    messages = this.props.messages.slice(this.props.messages.length - 200)
      .map((m, i) => {
        return ConsoleMessage({
          key: 'visible-' + i,
          pieces: m.pieces,
          severity: m.severity,
          category: m.category
        })
      });

    return div({ id: 'output-container',
                 className: 'hideTimestamps',
                 style: { width: '100%' }},
               messages);
  }
});

const OutputElementCull = Element({
  getInitialState: function() {
    return { scrollTop: 0,
             containerHeight: null,
             elementHeight: null };
  },

  componentDidMount: function() {
    let node = document.getElementById('output-wrapper');
    node.addEventListener('scroll', this.onScroll);

    setTimeout(() => {
      let rect = node.getBoundingClientRect();
      this.setState({ containerHeight: rect.height });
    }, 0);

    this.setElementHeight();
  },

  componentWillUpdate: function() {
    var el = document.getElementById('output-wrapper');
    if(this.state.containerHeight) {
      this.shouldScrollBottom = (el.scrollTop + this.state.containerHeight) >= el.scrollHeight;
    }
  },

  componentDidUpdate: function(prevProps) {
    if(!this.state.elementHeight) {
      this.setElementHeight();
    }
    if(this.shouldScrollBottom) {
      var el = document.getElementById('output-wrapper');
      el.scrollTop = el.scrollHeight;
    }
  },

  onScroll: function(ev) {
    this.setState({
      scrollTop: document.getElementById('output-wrapper').scrollTop
    });
  },

  setElementHeight: function() {
    let children = this.getDOMNode().children;
    if(children.length) {
      let rect = children[0].getBoundingClientRect();
      this.setState({ elementHeight: rect.height });
    }
  },

  render: function() {
    let state = this.state;
    let messages = [];
    let height = null;

    if(state.elementHeight) {
      let start = Math.max(0, (state.scrollTop / state.elementHeight | 0) - 1);
      let end = start + (state.containerHeight / state.elementHeight | 0) + 2;
      let offset = state.scrollTop % this.props.elementHeight;
      height = this.props.messages.length * state.elementHeight;

      messages = this.props.messages.slice(start, end).map((m, i) => {
        return ConsoleMessage({
          key: 'visible-' + i,
          pieces: m.pieces,
          severity: m.severity,
          category: m.category,
          style: state.elementHeight ? {
            position: 'absolute',
            top: ((start + i) * state.elementHeight) + 'px',
            bottom: 0,
            width: '100%'
          }: null
        })
      });
    }
    else if(this.props.messages.length) {
      messages = ConsoleMessage({
        pieces: this.props.messages[0].pieces
      });
    }

    return div({ id: 'output-container',
                 className: 'hideTimestamps',
                 style: { width: '100%',
                          height: height ? height : '' }},
               messages);
  }
});

let messages = [];
let renderTimer;
function reactAddMessage(msg) {
  messages.push(msg);
  if(!renderTimer) {
    renderTimer = mozRequestAnimationFrame(reactRender);
  }
}

function reactClearMessages() {
  messages = [];
  reactRender();
}

function reactRender() {
  React.render(OutputElementCull({
    messages: messages
  }), document.getElementById("output-container-mount"));
  renderTimer = null;
}

reactRender();
