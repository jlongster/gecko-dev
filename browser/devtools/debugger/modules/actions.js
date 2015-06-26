const constants = require('./constants');

function updateEventBreakpoints(eventNames) {
  return dispatch => {
    setNamedTimeout("event-breakpoints-update", 0, () => {
      dispatch({
        action: constants.UPDATE_EVENT_BREAKPOINTS,
        eventNames: eventNames
      });
    });
  }
}

module.exports = { updateEventBreakpoints };
