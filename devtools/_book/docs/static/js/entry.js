//const components = require('../../../client/shared/components');
const Box = require('../../../client/debugger/content/components/box');
const Panel = require('../../../client/debugger/content/components/panel');

const React = require('../../../client/shared/vendor/react.js');
const ReactDOM = require('../../../client/shared/vendor/react-dom.js');
const Redux = require('../../../client/shared/vendor/redux.js');

module.exports = {
  components: {
    Box, Panel
  },
  React, ReactDOM, Redux
};
