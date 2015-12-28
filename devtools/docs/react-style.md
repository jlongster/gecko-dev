
# React Style Guide

This is a guide for how to write good React components. It applies to
everything from generic, reusable components to app-specific
components.

## Requirements

When writing a React component, follow the following rules:

1. Only one React component per-file
2. Always add the `displayName` property
3. Always add the `propTypes` property to specify the required/optional properties
4. Use the `React.DOM` methods to construct DOM elements, preferrably assigning it to `dom` so it looks like `dom.div(...)`
5. When importing custom components, always wrap them with `React.createFactory` so you can instantiate them with a function call. Avoid using `React.createElement`.
6. **Avoid local state** and `setState` calls. Preferrably, only take properties and render something out.

## Writing Generic Components

The React community has gone through several patterns for how to
compose React components, but it generally has settled on a few
techniques. Which one you use depends on the type of component you are
building.

### Using `props.children`

The simplest way to make a component more generic is to allow
customize of its contents. This is super easy with React, you can just
use the `this.props.children` to access any elements passed in as children:

```js
const Square = React.createClass({
  render: function() {
    return dom.div({ style: {...}},
                   this.props.children)
  }
})

// Square({}, dom.div({}, "Hello!"))
```

### Components/Functions as Props

Sometimes you want more control over how the elements are created, so
you can accept a component or a function as a property. If you accept
a component, you can instantiate it however you like. This is useful
if you are building a component like a list, where the user can pass
in any kind of row component they wish.

If you accept a function, you can still instantiate it however you
like but the user can dynamically change the component per-call.

```js
const List = React.createClass({
  render: function() {
    return dom.div(
      { className: 'list' },
      this.props.items.map(item => {
        React.createElement(this.props.rowComponent, { item })
      })
    )
  }
})

// List({ items: items, rowComponent: React.createClass(...) })

// Or accept a function:

this.props.items.map(item => {
  React.createElement(this.props.getRowComponent(item), { item })
})

// List({ items: items, getRowComponent: item => { ... } })
```

### Hgher-order Components

The last and most advanced technique is create a higher-order
component. These are powerful because it allows you to separate out
behaviors into individual components and apply them wherever you want.

A higher-order component is just like a higher-order function: it is a
component that is created from another component. The interface for
doing this still just a function: you pass in a component and you get
back the higher-order component.

For example, assume we have the same `List` component above but we
only want to render the items in view. Let's create a `pagedList`
function that adds this basic optimization. Here's what it looks like
(and this is untested code):

```js
function pagedList(list) {
  return React.createClass({
    getInitialState: function() {
      return { currentIndex: 0 }
    },

    updateIndex: function() {
      // Calculate new index...
      this.setState({ currentIndex: newIndex });
    },

    render: function() {
      const { currentIndex } = this.state;
      if(this.props.pageSize) {
        const slice = this.props.items.slice(
          currentIndex,
          currentIndex + this.props.pageSize
        );
        React.createElement(list, {
          items: slice,
          onScroll: this.updateIndex
        });
      }
      else {
        React.createElement(list, { items: this.props.items })
      }
    }
  })
}
```

Usually higher-order components are created when exporting a simple
component. So in the `List` component definition, instead of just
exporting `List` we would do:

```js
module.exports = pagedList(List)
```

The point is, we don't care *what kind* of list this is. Maybe you
have 10 different kinds of lists. They can all benefit from this
optimization now.

The
[`connect`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
function provided by react-redux is another example of a higher-order component function.