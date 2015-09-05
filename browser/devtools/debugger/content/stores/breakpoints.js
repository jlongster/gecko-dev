/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const constants = require('../constants');
const promise = require('promise');
const { asPaused, rdpInvoke } = require('../utils');
const { PROMISE } = require('devtools/shared/fluxify/promiseMiddleware');
const {
  getSource, getBreakpoint, getBreakpoints, makeLocationId
} = require('../queries');

const initialState = {
  breakpoints: new Map()
}

function update(state = initialState, action, emitChange) {
  switch(action.type) {
  case constants.ADD_BREAKPOINT: {
    const id = makeLocationId(action.breakpoint.location);

    if(action.status === 'start') {
      const existingBp = state.breakpoints.get(id);
      const bp = existingBp || action.breakpoint;
      bp.disabled = false;
      bp.loading = true;
      if('condition' in action) {
        bp.condition = action.condition;
      }
      state.breakpoints.set(id, bp);
      emitChange(existingBp ? "breakpoint-enabled" : "breakpoint-added",
                 bp);
    }
    else if(action.status === 'done') {
      const { actor, text } = action.value;
      let { actualLocation } = action.value;

      // If the breakpoint moved, update the map
      if(actualLocation) {
        // TODO: The `setBreakpoint` RDP request rdp request returns
        // an `actualLocation` field it doesn't confirm to the regular
        // { actor, line } location shape, but it has a `source`
        // field. We should fix that.
        actualLocation = { actor: actualLocation.source.actor,
                           line: actualLocation.line };

        state.breakpoints.delete(id);

        const movedId = makeLocationId(actualLocation);
        const currentBp = state.breakpoints.get(movedId) || action.breakpoint;
        const prevLocation = currentBp.location;
        currentBp.location = actualLocation;
        state.breakpoints.set(movedId, currentBp);

        emitChange('breakpoint-moved', {
          breakpoint: currentBp,
          prevLocation: prevLocation
        });
      }

      const finalLocation = (
        actualLocation ? actualLocation : action.breakpoint.location
      );
      const bp = state.breakpoints.get(makeLocationId(finalLocation));
      bp.disabled = false;
      bp.loading = false;
      bp.actor = actor;
      bp.text = text;
      emitChange('breakpoint-updated', bp);
    }
    else if(action.status === 'error') {
      // Remove the optimistic update
      emitChange('breakpoint-removed', state.breakpoints.get(id));
      state.breakpoints.delete(id);
    }
    break;
  }

  case constants.REMOVE_BREAKPOINT: {
    if(action.status === 'done') {
      const id = makeLocationId(action.breakpoint.location);
      const bp = state.breakpoints.get(id);

      if(action.disabled) {
        bp.disabled = true;
        emitChange('breakpoint-disabled', bp);
      }
      else {
        state.breakpoints.delete(id);
        emitChange('breakpoint-removed', bp);
      }
    }
    break;
  }

  case constants.SET_BREAKPOINT_CONDITION: {
    const id = makeLocationId(action.breakpoint.location);
    const bp = state.breakpoints.get(id);

    if(action.status === 'start') {
      bp.loading = true;
      bp.condition = action.condition;
    }
    else if(action.status === 'done') {
      bp.loading = false;
      // Setting a condition creates a new breakpoint client as of
      // now, so we need to update the actor
      bp.actor = action.value.actor;
    }
    else if(action.status === 'error') {
      state.breakpoints.delete(id);
    }
    break;
  }}

  return state;
}

function addBreakpoints(bps) {
  return (dispatch, getState) => {
    asPaused(gThreadClient, () => {
      return promise.all(bps.map(loc => dispatch(addBreakpoint(bp))));
    });
  };
}

// TODO: this is a hack for now
const BREAKPOINT_CLIENT_STORE = new Map();

function setBreakpointClient(actor, client) {
  BREAKPOINT_CLIENT_STORE.set(actor, client);
}

function getBreakpointClient(actor) {
  return BREAKPOINT_CLIENT_STORE.get(actor);
}

function enableBreakpoint(location) {
  // Enabling is exactly the same as adding. It will use the existing
  // breakpoint that still stored.
  return addBreakpoint(location);
}

function _makeBreakpoint(state, location, condition) {
  const currentBp = getBreakpoint(state, location);

  if(currentBp) {
    if(currentBp.disabled) {
      // A disabled breakpoint exists, so reuse it so any properties
      // like conditions survive across disabling/enabling
      return currentBp;
    }
    else {
      // Do nothing because the breakpoint already exists
      return null;
    }
  }

  return { location, condition };
}

function addBreakpoint(location, condition) {
  return (dispatch, getState) => {
    const bp = _makeBreakpoint(getState(), location, condition);
    if(!bp) {
      // No breakpoint was made because it already exists and is
      // enabled, so don't do anything
      return;
    }

    return dispatch({
      type: constants.ADD_BREAKPOINT,
      breakpoint: bp,
      condition: condition,
      [PROMISE]: Task.spawn(function*() {
        console.log(getState());
        const sourceClient = gThreadClient.source(
          getSource(getState(), bp.location.actor)
        );
        const [response, bpClient] = yield rdpInvoke(sourceClient, sourceClient.setBreakpoint, {
          line: bp.location.line,
          column: bp.location.column,
          condition: bp.condition
        });
        const { isPending, actualLocation } = response;

        // Save the client instance
        setBreakpointClient(bpClient.actor, bpClient);

        return {
          // Preserve information about the breakpoint's line text, to
          // display it in the sources pane without requiring fetching the
          // source (for example, after the target navigated). Note that
          // this will get out of sync if the source text contents change.
          text: DebuggerView.editor.getText(bp.location.line - 1).trim(),

          // If the breakpoint response has an "actualLocation" attached, then
          // the original requested placement for the breakpoint wasn't
          // accepted.
          actualLocation: isPending ? null : actualLocation,

          actor: bpClient.actor
        };
      })
    });
  }
}

function disableBreakpoint(location) {
  return _removeBreakpoint(location, true);
}

function removeBreakpoint(location) {
  return _removeBreakpoint(location);
}

function _removeBreakpoint(location, isDisabled) {
  return (dispatch, getState) => {
    let bp = getBreakpoint(getState(), location);
    if (!bp) {
      throw new Error('attempt to remove breakpoint that does not exist');
    }
    if (bp.loading) {
      // TODO(jwl): make this wait until the breakpoint is saved if it
      // is still loading
      throw new Error('attempt to remove unsaved breakpoint');
    }


    const bpClient = getBreakpointClient(bp.actor);

    return dispatch({
      type: constants.REMOVE_BREAKPOINT,
      breakpoint: bp,
      disabled: isDisabled,
      [PROMISE]: rdpInvoke(bpClient, bpClient.remove)
    });
  }
}

function removeAllBreakpoints() {
  return (dispatch, getState) => {
    const breakpoints = getBreakpoints(getState());
    const activeBreakpoints = breakpoints.filter(bp => !bp.disabled);
    activeBreakpoints.forEach(bp => removeBreakpoint(bp.location));
  }
}

/**
 * Update the condition of a breakpoint.
 *
 * @param object aLocation
 *        @see DebuggerController.Breakpoints.addBreakpoint
 * @param string aClients
 *        The condition to set on the breakpoint
 * @return object
 *         A promise that will be resolved with the breakpoint client
 */
function setBreakpointCondition(location, condition) {
  return (dispatch, getState) => {
    let bp = getBreakpoint(getState(), location);
    if (!bp) {
      throw new Error("Breakpoint does not exist at the specified location");
    }
    if (bp.loading){
      // TODO(jwl): when this function is called, make sure the action
      // creator waits for the breakpoint to exist
      throw new Error("breakpoint must be saved");
    }

    let bpClient = getBreakpointClient(bp.actor);
    // `setCondition` returns a new breakpoint client, so removing the
    // current client marks that it's an "unsaved" breakpoint

    return dispatch({
      type: constants.SET_BREAKPOINT_CONDITION,
      breakpoint: bp,
      condition: condition,
      [PROMISE]: Task.spawn(function*() {
        const bpClient = yield rdpInvoke(bpClient,
                                         bpClient.setCondition,
                                         gThreadClient,
                                         condition);

        // Save the client instance
        setBreakpointClient(bpClient.actor, bpClient);

        return { actor: bpClient.actor };
      })
    });
  };
}

module.exports = {
  update,
  actions: {
    enableBreakpoint,
    addBreakpoint,
    addBreakpoints,
    disableBreakpoint,
    removeBreakpoint,
    removeAllBreakpoints,
    setBreakpointCondition
  }
}
