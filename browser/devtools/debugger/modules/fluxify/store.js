
const Store = {
  decorate: function(obj) {
    const handlers = {};

    obj.onChange = (dataName, cb) => {
      if(!(dataName in handlers)) {
        handlers[dataName] = [];
      }
      handlers[dataName].push(cb);
    };

    obj.emitChange = (dataName, data) => {
      if(dataName in handlers) {
        handlers[dataName].forEach(handler => handler(data));
      }
    };

    return obj;
  }
}

module.exports = Store;
