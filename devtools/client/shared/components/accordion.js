const React = require('devtools/client/shared/vendor/react');
const ReactDOM = require('devtools/client/shared/vendor/react-dom');
const dom = React.DOM;

const styles = {
  groups: {
    display: 'flex',
    flexDirection: 'column'
  },

  arrow: {
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '10px solid slategrey',
    display: 'inline-block',
    marginRight: '5px',
    transform: 'rotate(-90deg)',
    transition: 'transform .25s',
    width: 0,
    height: 0
  },

  arrowOpen: {
    transform: 'none'
  },

  groupName: {
    backgroundColor: '#d0d0d0',
    padding: '.5em',
    cursor: 'pointer',
    flex: 1
  },

  group: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  contents: {
    flex: 1,
    display: 'none'
  },

  contentsOpen: {
    display: 'block'
  }
}

const Accordion = React.createClass({
  getInitialState: function() {
    return { displayedGroups: [] };
  },

  toggleGroup: function(name) {
    const displayedGroups = this.state.displayedGroups;
    const isShown = displayedGroups.indexOf(name) !== -1;

    this.setState({
      displayedGroups: (isShown ?
                        displayedGroups.filter(x => x !== name) :
                        displayedGroups.concat([name]))
    });
  },

  render: function() {
    const groupNames = Object.keys(this.props.groups);

    return dom.div(
      { style: Object.assign({}, styles.group, this.props.style || {}) },
      groupNames.map(name => {
        const shown = this.state.displayedGroups.indexOf(name) !== -1;
        return dom.div(
          { style: styles.group,
            key: name },
          dom.div({ style: styles.groupName,
                    onClick: () => this.toggleGroup(name) },
                  dom.div({ style: Object.assign({}, styles.arrow, shown ? styles.arrowOpen : {}) }),
                  name),
          dom.div({ style: Object.assign({}, styles.contents, shown ? styles.contentsOpen : {}) },
                  this.props.groups[name])
        )
      })
    );
  }
});

module.exports = Accordion;
