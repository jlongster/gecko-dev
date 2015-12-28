const React = require("devtools/client/shared/vendor/react");
const ReactDOM = require("devtools/client/shared/vendor/react-dom");
const DevToolsEditor = require("devtools/client/sourceeditor/editor");
const dom = React.DOM;

const Editor = React.createClass({
  displayName: "Editor",

  propTypes: {
    text: React.PropTypes.string
  },

  componentDidMount: function() {
    this._editor = new DevToolsEditor({
      mode: DevToolsEditor.modes.js,
      readOnly: true,
      lineNumbers: true,
      showAnnotationRuler: true,
      enableCodeFolding: false
    });

    this._editor.appendTo(ReactDOM.findDOMNode(this)).then(() => {
      this._editor.container.style.width = '100%';
      this._editor.container.style.height = '100%';
      this.update();
    })
  },

  componentDidUpdate: function() {
    this.update();
  },

  update: function() {
    this._editor.setText(this.props.text);
  },

  render: function() {
    return dom.div({ style: this.props.style });
  }
});

module.exports = Editor;
