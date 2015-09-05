/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const constants = require('../constants');
const promise = require('promise');
const { rdpInvoke } = require('../utils');
const { PROMISE, HISTOGRAM_ID } = require('devtools/shared/fluxify/promiseMiddleware');
const { getSource, getSourceText } = require('../queries');

function getInitialState() {
  return {
    sources: new Map(),
    selectedSource: null,
    sourcesText: new Map()
  };
}

function update(state = getInitialState(), action, emitChange) {
  switch(action.type) {
  case constants.ADD_SOURCE:
    state.sources.set(action.source.actor, action.source);
    console.log('new efjsfjd SOURCE', state);
    emitChange('source', action.source);
    break;

  case constants.LOAD_SOURCES:
    if(action.status === 'done') {
      // We don't actually do anything with the state. Loading sources
      // actually forces the server to emit several individual
      // newSources packets which will eventually fire ADD_SOURCE
      // actions.
      emitChange('sources', state.sources);
    }
    break;

  case constants.SELECT_SOURCE:
    if(action.status === 'start') {
      state.selectedSource = action.source;
      emitChange('source-selected', action.source);
    }
    else if(action.status === 'done' &&
            state.selectedSource.actor === action.source.actor) {
      state.selectedSourceOpts = action.opts;
      emitChange('source-selected-ready', { source: action.source,
                                            opts: action.opts });
    }
    break;

  case constants.LOAD_SOURCE_TEXT:
    _updateText(state, action);
    emitChange('source-text-loaded', action.source);
    break;

  case constants.BLACKBOX:
    if(action.status === 'done') {
      const source = state.sources.get(action.source.actor)
      source.isBlackBoxed = action.value.isBlackBoxed;
      emitChange('blackboxed', action.source);
    }
    break;

  case constants.TOGGLE_PRETTY_PRINT:
    const source = state.sources.get(action.source.actor)
    _updateText(state, action);
    emitChange('source-text-loaded', action.source);

    if(action.status === 'done') {
      source.isPrettyPrinted = action.value.isPrettyPrinted;
      emitChange('prettyprinted', action.source);
    }
    break;

  case constants.UNLOAD:
    // Reset the entire state to just the initial state, a blank state
    // if you will.
    return getInitialState();
  }

  return state;
}

function _updateText(state, action) {
  const { source } = action;

  if(action.status === 'start') {
    state.sourcesText.set(source.actor, { loading: true });
  }
  else if(action.status === 'error') {
    state.sourcesText.set(source.actor, { error: action.error });
  }
  else {
    state.sourcesText.set(source.actor, {
      text: action.value.text,
      contentType: action.value.contentType
    });
  }
}

function getSourceClient(source) {
  return gThreadClient.source(source);
}

/**
 * Handler for the debugger client's unsolicited newSource notification.
 */
function newSource(event, packet) {
  return dispatch => {
    let source = packet.source;

    // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
    if (NEW_SOURCE_IGNORED_URLS.indexOf(source.url) != -1) {
      return;
    }

    // Make sure the events listeners are up to date.
    // if (DebuggerView.instrumentsPaneTab == "events-tab") {
    //   dispatcher.dispatch(actions.fetchEventListeners());
    // }

    // Signal that a new source has been added.
    // window.emit(EVENTS.NEW_SOURCE);

    return dispatch({
      type: constants.ADD_SOURCE,
      source: source
    });
  };
}

function selectSource(source, opts) {
  return dispatch => {
    // This is mostly just a wrapper around `loadSourceText`. It's
    // different in two ways: it *always* fires actions, whereas
    // `loadSourceText` will not fire any if the source is already
    // loaded. Secondly, this tags an options object along with it,
    // specifying various ways the editor should move the cursor.
    return dispatch({
      type: constants.SELECT_SOURCE,
      source: source,
      opts: opts,
      [PROMISE]: dispatch(loadSourceText(source)) || promise.resolve()
    });
  };
}

function loadSources() {
  return {
    type: constants.LOAD_SOURCES,
    [PROMISE]: Task.spawn(function*() {
      const response = yield rdpInvoke(gThreadClient, gThreadClient.getSources);

      // Top-level breakpoints may pause the entire loading process
      // because scripts are executed as they are loaded, so the
      // engine may pause in the middle of loading all the sources.
      // This is relatively harmless, and I'm not sure we should throw
      // an error, but earlier code did so I'm copying it.
      if(!response.sources) {
        throw new Error(
          "Error getting sources, probably because a top-level " +
          "breakpoint was hit while executing them"
        )
      }

      // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
      return response.sources.filter(source => {
        return NEW_SOURCE_IGNORED_URLS.indexOf(source.url) === -1;
      });
    })
  }
}

/**
 * Set the black boxed status of the given source.
 *
 * @param Object aSource
 *        The source form.
 * @param bool aBlackBoxFlag
 *        True to black box the source, false to un-black box it.
 * @returns Promise
 *          A promize that resolves to [aSource, isBlackBoxed] or rejects to
 *          [aSource, error].
 */
function blackbox(source, shouldBlackBox) {
  const client = getSourceClient(source);

  return {
    type: constants.BLACKBOX,
    source: source,
    [PROMISE]: Task.spawn(function*() {
      yield rdpInvoke(client,
                      shouldBlackBox ? client.blackBox : client.unblackBox);
      return {
        isBlackBoxed: shouldBlackBox
      }
    })
  };
}

/**
 * Toggle the pretty printing of a source's text. All subsequent calls to
 * |getText| will return the pretty-toggled text. Nothing will happen for
 * non-javascript files.
 *
 * @param Object aSource
 *        The source form from the RDP.
 * @returns Promise
 *          A promise that resolves to [aSource, prettyText] or rejects to
 *          [aSource, error].
 */
function togglePrettyPrint(source) {
  // Only attempt to pretty print JavaScript sources.
  if (!SourceUtils.isJavaScript(source.url, source.contentType)) {
    // TODO(jwl): show this error
    // this.emitChange('pretty-printed', {
    //   error: "Can't prettify non-javascript files."
    // });
    return;
  }

  const sourceClient = getSourceClient(source);
  const wantPretty = !source.isPrettyPrinted;

  return {
    type: constants.TOGGLE_PRETTY_PRINT,
    source: source,
    [PROMISE]: Task.spawn(function*() {
      let response;

      if(wantPretty) {
        response = yield rdpInvoke(sourceClient,
                                   sourceClient.prettyPrint,
                                   Prefs.editorTabSize);
      }
      else {
        response = yield rdpInvoke(sourceClient,
                                   sourceClient.disablePrettyPrint);
      }
      const { source: text, contentType } = response;

      // Remove the cached source AST from the Parser, to avoid getting
      // wrong locations when searching for functions.
      DebuggerController.Parser.clearSource(source.url);

      return {
        isPrettyPrinted: wantPretty,
        text: text,
        contentType: contentType
      };
    })
  };
}

function loadSourceText(source) {
  return (dispatch, getState) => {
    // Fetch the source text only once.
    let textInfo = getSourceText(getState(), source.actor);
    if (textInfo) {
      // It's already loaded or is loading
      return;
    }

    const sourceClient = getSourceClient(source);

    return dispatch({
      type: constants.LOAD_SOURCE_TEXT,
      source: source,
      [HISTOGRAM_ID]: "DEVTOOLS_DEBUGGER_DISPLAY_SOURCE_%_MS",
      [PROMISE]: Task.spawn(function*() {
        const response = yield rdpInvoke(sourceClient, sourceClient.source);

        // TODO(jwl): do I really need to do this?
        // source.contentType = contentType;

        // Automatically pretty print if enabled and the test is
        // detected to be "minified"
        // if (Prefs.autoPrettyPrint && !source.client.isPrettyPrinted) {
        //   if(SourceUtils.isMinified(source.actor, text)) {
        //     togglePrettyPrint(source);
        //   }
        // }

        return { text: response.source,
                 contentType: response.contentType };
      })
    });
  }
}

// /**
//  * Starts fetching all the sources, silently.
//  *
//  * @param array aUrls
//  *        The urls for the sources to fetch. If fetching a source's text
//  *        takes too long, it will be discarded.
//  * @return object
//  *         A promise that is resolved after source texts have been fetched.
//  */
function getTextForSources(actors) {
  return (dispatch, getState) => {
    let deferred = promise.defer();
    let pending = new Set(actors);
    let fetched = [];

    // Can't use promise.all, because if one fetch operation is rejected, then
    // everything is considered rejected, thus no other subsequent source will
    // be getting fetched. We don't want that. Something like Q's allSettled
    // would work like a charm here.

    // Try to fetch as many sources as possible.
    for (let actor of actors) {
      let sourceItem = DebuggerView.Sources.getItemByValue(actor);
      let sourceForm = sourceItem.attachment.source;
      dispatch(loadSourceText(getSource(getState(), actor)))
        .then(onFetch, onError);
      setTimeout(onTimeout, FETCH_SOURCE_RESPONSE_DELAY);
    }

    /* Called if fetching a source takes too long. */
    function onTimeout(aSource) {
      onError([aSource]);
    }

    /* Called if fetching a source finishes successfully. */
    function onFetch([aSource, aText, aContentType]) {
      // If fetching the source has previously timed out, discard it this time.
      if (!pending.has(aSource.actor)) {
        return;
      }
      pending.delete(aSource.actor);
      fetched.push([aSource.actor, aText, aContentType]);
      maybeFinish();
    }

    /* Called if fetching a source failed because of an error. */
    function onError([aSource, aError]) {
      pending.delete(aSource.actor);
      maybeFinish();
    }

    /* Called every time something interesting happens while fetching sources. */
    function maybeFinish() {
      if (pending.size == 0) {
        // Sort the fetched sources alphabetically by their url.
        deferred.resolve(fetched.sort(([aFirst], [aSecond]) => aFirst > aSecond));
      }
    }

    return deferred.promise;
  };
}

module.exports = {
  update,
  actions: {
    newSource,
    selectSource,
    loadSources,
    blackbox,
    togglePrettyPrint,
    loadSourceText,
    getTextForSources
  }
};
