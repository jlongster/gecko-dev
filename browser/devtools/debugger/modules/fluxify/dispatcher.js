
function entries(obj) {
  return Object.keys(obj).map(k => [k, obj[k]]);
}

function createDispatcher() {
  let stores = {};
  let isDispatching = false;

  function registerStore(name, store) {
    stores[name] = store;
  }

  function wrapAction(actionCreator) {
    return (...args) => {
      const action = actionCreator(...args);
      if(typeof action === 'function') {
        action(dispatch, stores);
      }
      else {
        dispatch(action);
      }
    }
  }

  function wrapActions(actionCreators) {
    let actions = {};
    for(let k in actionCreators) {
      actions[k] = wrapAction(actionCreators[k]);
    }
    return actions;
  }

  function dispatch(payload) {
    if(isDispatching) {
      throw new Error('Cannot dispatch in the middle of a dispatch');
    }
    if(!payload.action) {
      throw new Error('action is null, did you make a typo when publishing this payload? ' +
                      JSON.stringify(payload, null, 2));
    }

    isDispatching = true;
    try {
      entries(stores).forEach(([name, store]) => {
        if(store[payload.action]) {
          store[payload.action](payload);
        }
      });
    }
    finally {
      isDispatching = false;
    }
  }

  return {
    registerStore,
    wrapAction,
    wrapActions
  };
}

module.exports = createDispatcher;
