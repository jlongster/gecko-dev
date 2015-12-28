
# Box & Panel

A `Box` component represents an instance of a flexbox container that
has panels inside of it (think of an element with `display: flex`). A
`Panel` component represents a child of a flexbox container (an
element with various `flex` properties).

A `Panel` has additional behaviors than basic elements, like the
ability to be "closed" and the ability to be resized dynamically
(TODO).

Using just these two components, you can perform complex layouts that
satisfy most of the needs for your tool.

## Properties

### Panel

* **closed** - boolean, `true` if the element should not be displayed
* **shrink** - boolean, `true` if the panel should only take up as much space as needed
* **size** - number|string, the static width or height of the element

A `Panel` should only be given one child element. It will not render
an intermediate DOM element, but instead will render the child element
with the generated flex properties. This is necessary for the layout
to work.

### Box

* **vertical** - boolean, `true` for child panels to flow vertically

## Examples

This shows 3 panels, the first two which will take up as much space as
the can and the third one at a fixed size of 50px.

```js
Box(
  null,
  Panel(null,
        div({ style: { backgroundColor: 'tomato' }}, 'Panel1')),
  Panel(null,
        div({ style: { backgroundColor: 'skyblue' }}, 'Panel2')),
  Panel({ size: 50 },
        div({ style: { backgroundColor: 'wheat' }}, 'Panel3'))
)
```

<div id="example1" style="margin: 1.5em 0"></div>

This shows 2 panels laid out vertically, with the second panel taking
as little space as it can.

```js
Box(
  { vertical: true,
    style: { height: 100 }},
  Panel(null,
        div({ style: { backgroundColor: 'tomato' }}, 'Panel1')),
  Panel({ shrink: true },
        div({ style: { backgroundColor: 'wheat' }}, 'Panel2'))
)
```

<div id="example2" style="margin: 1.5em 0"></div>

<script>
var Box = React.createFactory(components.Box);
var Panel = React.createFactory(components.Panel);

React.render(
  Box(
    null,
    Panel(null, React.DOM.div({ style: { backgroundColor: 'tomato' }}, 'Panel1')),
    Panel(null, React.DOM.div({ style: { backgroundColor: 'skyblue' }}, 'Panel2')),
    Panel({ size: 50 }, React.DOM.div({ style: { backgroundColor: 'wheat' }}, 'Panel3'))
  ),
  document.querySelector('#example1')
);

React.render(
  Box(
    { vertical: true,
      style: { height: 100 }},
    Panel(null, React.DOM.div({ style: { backgroundColor: 'tomato' }}, 'Panel1')),
    Panel({ shrink: true }, React.DOM.div({ style: { backgroundColor: 'wheat' }}, 'Panel2'))
  ),
  document.querySelector('#example2')
);
</script>
