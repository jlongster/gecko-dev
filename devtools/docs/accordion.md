
# Accordion

Here is the accordion. You can use it like this:

```js
Accordion({
  style: { backgroundColor: '#f0f0f0' },
  groups: {
    Names: Names(),
    Tools: Tools()
  }
})
```

## Live Demo

<div id="example1"></div>

<script>
var Names = React.createClass({
  render: function() {
    return React.DOM.ul(
      null,
      React.DOM.li(null, 'James'),
      React.DOM.li(null, 'Jordan'),
      React.DOM.li(null, 'Helen')
    )
  }
});

var Tools = React.createClass({
  render: function() {
    return React.DOM.ul(
      null,
      React.DOM.li(null, 'Debugger'),
      React.DOM.li(null, 'Inspector'),
      React.DOM.li(null, 'Performance')
    )
  }
});

React.render(
  React.createElement(
    components.Accordion,
    { style: { backgroundColor: '#f0f0f0' },
      groups: {
        Names: React.createElement(Names),
        Tools: React.createElement(Tools)
      }
    }
  ),
  document.querySelector('#example1')
)
</script>
