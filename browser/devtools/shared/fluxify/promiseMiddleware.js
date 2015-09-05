/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const uuidgen = require('sdk/util/uuid').uuid;
const {
  entries, toObject, reportException, executeSoon
} = require('devtools/toolkit/DevToolsUtils');
const PROMISE = "@@dispatch/promise";
const HISTOGRAM_ID = "@@dispatch/histogramId";

function promiseMiddleware(getTargetClient) {
  return dispatcher => next => action => {
    if(!(PROMISE in action)) {
      return next(action);
    }

    const { dispatch } = dispatcher;
    const promise = action[PROMISE];
    const id = uuidgen().toString();

    // Create a new action that doesn't have the promise field and has
    // the `seqId` field that represents the sequence id
    action = Object.assign(
      toObject(entries(action).filter(pair => pair[0] !== PROMISE)),
      { seqId: id }
    );

    let histogram, startTime;
    const client = getTargetClient ? getTargetClient() : null;
    if(client && HISTOGRAM_ID in action) {
      const transportType = client.localTransport ? "LOCAL" : "REMOTE";
      const histogramId = action[HISTOGRAM_ID].replace("%", transportType);
      histogram = Services.telemetry.getHistogramById(histogramId);
      startTime = Date.now();
    }

    dispatch(Object.assign({}, action, { status: 'start' }));

    promise.then(value => {
      if(histogram) {
        histogram.add(startTime - Date.now());
      }

      executeSoon(() => {
        dispatch(Object.assign({}, action, {
          status: 'done',
          value: value
        }));
      });
    }).catch(err => {
      executeSoon(() => {
        dispatch(Object.assign({}, action, {
          status: 'error',
          error: err
        }));
      });

      reportException("promiseMiddleware", err);
    });

    // Return the promise so action creators can still compose if they
    // want to.
    return promise;
  };
}

module.exports = {
  PROMISE: PROMISE,
  HISTOGRAM_ID: HISTOGRAM_ID,
  middleware: promiseMiddleware
};
