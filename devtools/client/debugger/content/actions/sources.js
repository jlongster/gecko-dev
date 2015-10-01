/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const constants = require('../constants');
const promise = require('promise');
const { rdpInvoke } = require('../utils');
const { dumpn } = require("devtools/shared/DevToolsUtils");
const { PROMISE, HISTOGRAM_ID } = require('devtools/client/shared/redux/middleware/promise');
const { getSource, getSourceText } = require('../queries');

const NEW_SOURCE_IGNORED_URLS = ["debugger eval code", "XStringBundle"];

function getSourceClient(source) {
  if(!gThreadClient) {
    dump(new Error().stack + '\n');
  }
  return gThreadClient.source(source);
}

/**
 * Handler for the debugger client's unsolicited newSource notification.
 */
function newSource(source) {
  return dispatch => {
    // Ignore bogus scripts, e.g. generated from 'clientEvaluate' packets.
    if (NEW_SOURCE_IGNORED_URLS.indexOf(source.url) != -1) {
      return;
    }

    // Signal that a new source has been added.
    window.emit(EVENTS.NEW_SOURCE);

    return dispatch({
      type: constants.ADD_SOURCE,
      source: source
    });
  };
}

function selectSource(source, opts) {
  return (dispatch, getState) => {
    if(!gThreadClient) {
      // No connection, do nothing. This happens when the debugger is
      // shutdown too fast and it tries to display a default source.
      return;
    }

    source = getSource(getState(), source.actor);

    dispatch(loadSourceText(source));
    dispatch({
      type: constants.SELECT_SOURCE,
      source: source,
      opts: opts
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
      // This is relatively harmless, as individual `newSource`
      // notifications are fired for each script and they will be
      // added to the UI through that.
      if(!response.sources) {
        dumpn(
          "Error getting sources, probably because a top-level " +
          "breakpoint was hit while executing them"
        );
        return;
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
        if (Prefs.autoPrettyPrint &&
            !source.isPrettyPrinted &&
            SourceUtils.isMinified(source.actor, response.source)) {
          dispatch(togglePrettyPrint(source));
        }

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
  newSource,
  selectSource,
  loadSources,
  blackbox,
  togglePrettyPrint,
  loadSourceText,
  getTextForSources
};
