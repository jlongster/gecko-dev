(function (global, factory) {
  factory(exports, require('./typed'), require('devtools/shared/content/immutable'));
})(this, function (exports, _typed, _immutable) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  var ImmutableList = _immutable.List;
  var Indexed = _immutable.Iterable.Indexed;

  var $store = _typed.Typed.store;
  var $type = _typed.Typed.type;
  var $read = _typed.Typed.read;
  var $step = _typed.Typed.step;
  var $init = _typed.Typed.init;
  var $result = _typed.Typed.result;
  var $label = _typed.Typed.label;
  var $typeName = _typed.Typed.typeName;
  var $empty = _typed.Typed.empty;

  var change = function change(list, f) {
    var store = f(list[$store]);
    if (store === list[$store]) {
      return list;
    } else {
      var result = list.__ownerID ? list : (0, _typed.construct)(list);
      result[$store] = store;
      result.size = store.size;
      return result;
    }
  };

  var _clear = function _clear(target) {
    return target.clear();
  };
  var _pop = function _pop(target) {
    return target.pop();
  };
  var _shift = function _shift(target) {
    return target.shift();
  };

  var TypeInferer = (function (_Type) {
    _inherits(TypeInferer, _Type);

    function TypeInferer() {
      _classCallCheck(this, TypeInferer);

      _get(Object.getPrototypeOf(TypeInferer.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(TypeInferer, [{
      key: _typed.Typed.typeName,
      value: function value() {
        return 'TypeInferer';
      }
    }, {
      key: _typed.Typed.read,
      value: function value(_value) {
        // typeOf usually creates type for the value with that
        // value being a default. For type inference we should
        // actually use a base type instead of type with default
        // there for we use prototype of the constructor.
        var type = (0, _typed.typeOf)(_value).constructor.prototype;
        this.type = this.type ? (0, _typed.Union)(this.type, type) : type;
        return _value;
      }
    }]);

    return TypeInferer;
  })(_typed.Type);

  function BaseImmutableList() {}
  BaseImmutableList.prototype = ImmutableList.prototype;

  var TypeInferedList = (function (_BaseImmutableList) {
    _inherits(TypeInferedList, _BaseImmutableList);

    _createClass(TypeInferedList, null, [{
      key: 'from',
      value: function from(list) {
        var result = (0, _typed.construct)(this.prototype);
        result[$store] = list[$store];
        result.size = list.size;
        return result;
      }
    }]);

    function TypeInferedList(value) {
      _classCallCheck(this, TypeInferedList);

      _get(Object.getPrototypeOf(TypeInferedList.prototype), 'constructor', this).call(this);
      return TypeInferedList.prototype[$read](value);
    }

    _createClass(TypeInferedList, [{
      key: _typed.Typed.init,
      value: function value() {
        var result = (0, _typed.construct)(this).asMutable();
        result[$type] = new TypeInferer();
        return result;
      }
    }, {
      key: _typed.Typed.result,
      value: function value(result) {
        var list = result.asImmutable();
        list[$type] = result[$type].type;

        return list;
      }
    }, {
      key: _typed.Typed.read,
      value: function value(input) {
        var Type = this.constructor;

        if (input === null || input === void 0) {
          if (!this[$empty]) {
            var result = (0, _typed.construct)(this);
            result[$store] = ImmutableList();
            result.size = 0;
            this[$empty] = result;
          }

          return this[$empty];
        }

        if (input instanceof Type && input && input.constructor === Type) {
          return input;
        }

        var source = Indexed(input);
        var isEmpty = source.size === 0;

        if (isEmpty && this[$empty]) {
          return this[$empty];
        }

        var list = this[$init]();
        list.size = source.size;
        source.forEach(function (value, index) {
          list.set(index, value);
        });

        list = this[$result](list);

        if (isEmpty) {
          this[$empty] = list;
        }

        return list;
      }
    }, {
      key: _typed.Typed.step,
      value: function value(result, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var _value2 = _ref2[1];

        return change(result, function () {
          var store = arguments.length <= 0 || arguments[0] === undefined ? ImmutableList() : arguments[0];
          return store.set(key, _value2);
        });
      }
    }, {
      key: _typed.Typed.typeName,
      value: function value() {
        return this[$label] || 'Typed.List(' + this[$type][$typeName]() + ')';
      }
    }, {
      key: 'toString',
      value: function toString() {
        return this.__toString(this[$typeName]() + '([', '])');
      }
    }, {
      key: 'has',
      value: function has(key) {
        return this[$store].has(key);
      }
    }, {
      key: 'get',
      value: function get(index, notSetValue) {
        return this[$store] ? this[$store].get(index, notSetValue) : notSetValue;
      }
    }, {
      key: 'clear',
      value: function clear() {
        if (this.__ownerID) {
          return change(this, _clear);
        }

        return this[$empty] || this[$read]();
      }
    }, {
      key: 'remove',
      value: function remove(index) {
        return change(this, function (store) {
          return store && store.remove(index);
        });
      }
    }, {
      key: 'set',
      value: function set(index, value) {
        if (index > this.size) {
          throw TypeError('Index "' + index + '" is out of bound');
        }

        var result = this[$type][$read](value);

        if (result instanceof TypeError) {
          throw TypeError('Invalid value: ' + result.message);
        }

        return this[$step](this, [index, result]);
      }
    }, {
      key: 'push',
      value: function push() {
        var type = this[$type];
        var items = [];

        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        var count = values.length;
        var index = 0;
        while (index < count) {
          var value = values[index];
          var result = type[$read](value);

          if (result instanceof TypeError) {
            throw TypeError('Invalid value: ' + result.message);
          }

          items.push(result);
          index = index + 1;
        }

        return change(this, function (store) {
          return store ? store.push.apply(store, items) : ImmutableList.apply(undefined, items);
        });
      }
    }, {
      key: 'pop',
      value: function pop() {
        return change(this, _pop);
      }
    }, {
      key: 'unshift',
      value: function unshift() {
        var type = this[$type];
        var items = [];

        for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          values[_key2] = arguments[_key2];
        }

        var count = values.length;
        var index = 0;

        while (index < count) {
          var value = values[index];
          var result = type[$read](value);

          if (result instanceof TypeError) {
            throw TypeError('Invalid value: ' + result.message);
          }

          items.push(result);
          index = index + 1;
        }

        return change(this, function (store) {
          return store ? store.unshift.apply(store, items) : ImmutableList.apply(undefined, items);
        });
      }
    }, {
      key: 'shift',
      value: function shift() {
        return change(this, _shift);
      }
    }, {
      key: 'setSize',
      value: function setSize(size) {
        if (size > this.size) {
          throw TypeError('setSize may only downsize');
        }

        return change(this, function (store) {
          return store.setSize(size);
        });
      }
    }, {
      key: 'slice',
      value: function slice(begin, end) {
        return change(this, function (store) {
          return store && store.slice(begin, end);
        });
      }
    }, {
      key: 'wasAltered',
      value: function wasAltered() {
        return this[$store].wasAltered();
      }
    }, {
      key: '__ensureOwner',
      value: function __ensureOwner(ownerID) {
        var result = this.__ownerID === ownerID ? this : !ownerID ? this : (0, _typed.construct)(this);

        result.__ownerID = ownerID;
        result[$store] = this[$store] ? this[$store].__ensureOwner(ownerID) : ImmutableList().__ensureOwner(ownerID);
        result.size = result[$store].size;

        return result;
      }
    }, {
      key: '__iterator',
      value: function __iterator(type, reverse) {
        var _this = this;

        return Indexed(this[$store]).map(function (_, key) {
          return _this.get(key);
        }).__iterator(type, reverse);
      }
    }, {
      key: '__iterate',
      value: function __iterate(f, reverse) {
        var _this2 = this;

        return Indexed(this[$store]).map(function (_, key) {
          return _this2.get(key);
        }).__iterate(f, reverse);
      }
    }]);

    return TypeInferedList;
  })(BaseImmutableList);

  TypeInferedList.prototype[_typed.Typed.DELETE] = TypeInferedList.prototype.remove;

  var BaseTypeInferedList = function BaseTypeInferedList() {};
  BaseTypeInferedList.prototype = TypeInferedList.prototype;

  var TypedList = (function (_BaseTypeInferedList) {
    _inherits(TypedList, _BaseTypeInferedList);

    function TypedList() {
      _classCallCheck(this, TypedList);

      _get(Object.getPrototypeOf(TypedList.prototype), 'constructor', this).call(this);
    }

    _createClass(TypedList, [{
      key: _typed.Typed.init,
      value: function value() {
        return (0, _typed.construct)(this).asMutable();
      }
    }, {
      key: _typed.Typed.result,
      value: function value(result) {
        return result.asImmutable();
      }
    }, {
      key: 'map',
      value: function map(mapper, context) {
        if (this.size === 0) {
          return this;
        } else {
          var result = TypeInferedList.from(this).map(mapper, context);
          if (this[$store] === result[$store]) {
            return this;
          }
          if (result[$type] === this[$type]) {
            var list = (0, _typed.construct)(this);
            list[$store] = result[$store];
            list.size = result.size;
            return list;
          } else {
            return result;
          }
        }
      }
    }]);

    return TypedList;
  })(BaseTypeInferedList);

  var List = function List(descriptor, label) {
    var _Object$create;

    if (descriptor === void 0) {
      throw TypeError("Typed.List must be passed a type descriptor");
    }

    if (descriptor === _typed.Any) {
      return _immutable.List;
    }

    var type = (0, _typed.typeOf)(descriptor);

    if (type === _typed.Any) {
      throw TypeError("Typed.List was passed an invalid type descriptor: ${descriptor}");
    }

    var ListType = function ListType(value) {
      var isListType = this instanceof ListType;
      var Type = isListType ? this.constructor : ListType;

      if (value instanceof Type) {
        return value;
      }

      var result = Type.prototype[$read](value);

      if (result instanceof TypeError) {
        throw result;
      }

      // `list.map(f)` will in fact cause `list.constructor(items)` to be
      // invoked there for we need to check if `this[$store]` was
      // assigned to know if it's that or if it's a `new ListType()` call.
      if (isListType && !this[$store]) {
        this[$store] = result[$store];
        this.size = result.size;
      } else {
        return result;
      }

      return this;
    };
    ListType.of = ImmutableList.of;
    ListType.prototype = Object.create(ListPrototype, (_Object$create = {
      constructor: { value: ListType }
    }, _defineProperty(_Object$create, $type, { value: type }), _defineProperty(_Object$create, $label, { value: label }), _Object$create));

    return ListType;
  };
  exports.List = List;
  List.Type = TypedList;
  List.prototype = TypedList.prototype;
  var ListPrototype = TypedList.prototype;
});
//# sourceMappingURL=data:application/json;base64,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QTtBQUNwQyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFBIiwiZmlsZSI6Imxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGVkLCBUeXBlLCBVbmlvbiwgQW55LCB0eXBlT2YsIGNvbnN0cnVjdH0gZnJvbSBcIi4vdHlwZWRcIlxuaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcblxuXG5jb25zdCBJbW11dGFibGVMaXN0ID0gSW1tdXRhYmxlLkxpc3RcbmNvbnN0IHtJbmRleGVkfSA9IEltbXV0YWJsZS5JdGVyYWJsZVxuXG5jb25zdCAkc3RvcmUgPSBUeXBlZC5zdG9yZVxuY29uc3QgJHR5cGUgPSBUeXBlZC50eXBlXG5jb25zdCAkcmVhZCA9IFR5cGVkLnJlYWRcbmNvbnN0ICRzdGVwID0gVHlwZWQuc3RlcFxuY29uc3QgJGluaXQgPSBUeXBlZC5pbml0XG5jb25zdCAkcmVzdWx0ID0gVHlwZWQucmVzdWx0XG5jb25zdCAkbGFiZWwgPSBUeXBlZC5sYWJlbFxuY29uc3QgJHR5cGVOYW1lID0gVHlwZWQudHlwZU5hbWVcbmNvbnN0ICRlbXB0eSA9IFR5cGVkLmVtcHR5XG5cblxuY29uc3QgY2hhbmdlID0gKGxpc3QsIGYpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSBmKGxpc3RbJHN0b3JlXSlcbiAgaWYgKHN0b3JlID09PSBsaXN0WyRzdG9yZV0pIHtcbiAgICByZXR1cm4gbGlzdFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlc3VsdCA9IGxpc3QuX19vd25lcklEID8gbGlzdCA6IGNvbnN0cnVjdChsaXN0KVxuICAgIHJlc3VsdFskc3RvcmVdID0gc3RvcmVcbiAgICByZXN1bHQuc2l6ZSA9IHN0b3JlLnNpemVcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuY29uc3QgY2xlYXIgPSB0YXJnZXQgPT4gdGFyZ2V0LmNsZWFyKClcbmNvbnN0IHBvcCA9IHRhcmdldCA9PiB0YXJnZXQucG9wKClcbmNvbnN0IHNoaWZ0ID0gdGFyZ2V0ID0+IHRhcmdldC5zaGlmdCgpXG5cbmNsYXNzIFR5cGVJbmZlcmVyIGV4dGVuZHMgVHlwZSB7XG4gIFtUeXBlZC50eXBlTmFtZV0oKSB7XG4gICAgcmV0dXJuICdUeXBlSW5mZXJlcidcbiAgfVxuICBbVHlwZWQucmVhZF0odmFsdWUpIHtcbiAgICAvLyB0eXBlT2YgdXN1YWxseSBjcmVhdGVzIHR5cGUgZm9yIHRoZSB2YWx1ZSB3aXRoIHRoYXRcbiAgICAvLyB2YWx1ZSBiZWluZyBhIGRlZmF1bHQuIEZvciB0eXBlIGluZmVyZW5jZSB3ZSBzaG91bGRcbiAgICAvLyBhY3R1YWxseSB1c2UgYSBiYXNlIHR5cGUgaW5zdGVhZCBvZiB0eXBlIHdpdGggZGVmYXVsdFxuICAgIC8vIHRoZXJlIGZvciB3ZSB1c2UgcHJvdG90eXBlIG9mIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBjb25zdCB0eXBlID0gdHlwZU9mKHZhbHVlKS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICB0aGlzLnR5cGUgPSB0aGlzLnR5cGUgPyBVbmlvbih0aGlzLnR5cGUsIHR5cGUpIDogdHlwZVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG5cbmZ1bmN0aW9uIEJhc2VJbW11dGFibGVMaXN0KCkge31cbkJhc2VJbW11dGFibGVMaXN0LnByb3RvdHlwZSA9IEltbXV0YWJsZUxpc3QucHJvdG90eXBlXG5cbmNsYXNzIFR5cGVJbmZlcmVkTGlzdCBleHRlbmRzIEJhc2VJbW11dGFibGVMaXN0IHtcbiAgc3RhdGljIGZyb20obGlzdCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0cnVjdCh0aGlzLnByb3RvdHlwZSlcbiAgICByZXN1bHRbJHN0b3JlXSA9IGxpc3RbJHN0b3JlXVxuICAgIHJlc3VsdC5zaXplID0gbGlzdC5zaXplXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICByZXR1cm4gVHlwZUluZmVyZWRMaXN0LnByb3RvdHlwZVskcmVhZF0odmFsdWUpXG4gIH1cbiAgW1R5cGVkLmluaXRdKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0cnVjdCh0aGlzKS5hc011dGFibGUoKVxuICAgIHJlc3VsdFskdHlwZV0gPSBuZXcgVHlwZUluZmVyZXIoKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICBbVHlwZWQucmVzdWx0XShyZXN1bHQpIHtcbiAgICBjb25zdCBsaXN0ID0gcmVzdWx0LmFzSW1tdXRhYmxlKClcbiAgICBsaXN0WyR0eXBlXSA9IHJlc3VsdFskdHlwZV0udHlwZVxuXG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIFtUeXBlZC5yZWFkXShpbnB1dCkge1xuICAgIGNvbnN0IFR5cGUgPSB0aGlzLmNvbnN0cnVjdG9yXG5cbiAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgaW5wdXQgPT09IHZvaWQoMCkpIHtcbiAgICAgIGlmICghdGhpc1skZW1wdHldKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0cnVjdCh0aGlzKVxuICAgICAgICByZXN1bHRbJHN0b3JlXSA9IEltbXV0YWJsZUxpc3QoKVxuICAgICAgICByZXN1bHQuc2l6ZSA9IDBcbiAgICAgICAgdGhpc1skZW1wdHldID0gcmVzdWx0XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzWyRlbXB0eV1cbiAgICB9XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBUeXBlICYmIGlucHV0ICYmIGlucHV0LmNvbnN0cnVjdG9yID09PSBUeXBlKSB7XG4gICAgICByZXR1cm4gaW5wdXRcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSBJbmRleGVkKGlucHV0KVxuICAgIGNvbnN0IGlzRW1wdHkgPSBzb3VyY2Uuc2l6ZSA9PT0gMFxuXG4gICAgaWYgKGlzRW1wdHkgJiYgdGhpc1skZW1wdHldKSB7XG4gICAgICByZXR1cm4gdGhpc1skZW1wdHldXG4gICAgfVxuXG5cbiAgICBsZXQgbGlzdCA9IHRoaXNbJGluaXRdKClcbiAgICBsaXN0LnNpemUgPSBzb3VyY2Uuc2l6ZVxuICAgIHNvdXJjZS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgIGxpc3Quc2V0KGluZGV4LCB2YWx1ZSlcbiAgICB9KVxuXG4gICAgbGlzdCA9IHRoaXNbJHJlc3VsdF0obGlzdClcblxuICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICB0aGlzWyRlbXB0eV0gPSBsaXN0XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuICBbVHlwZWQuc3RlcF0ocmVzdWx0LCBba2V5LCB2YWx1ZV0pIHtcbiAgICByZXR1cm4gY2hhbmdlKHJlc3VsdCwgKHN0b3JlPUltbXV0YWJsZUxpc3QoKSkgPT4gc3RvcmUuc2V0KGtleSwgdmFsdWUpKVxuICB9XG5cbiAgW1R5cGVkLnR5cGVOYW1lXSgpIHtcbiAgICByZXR1cm4gdGhpc1skbGFiZWxdIHx8IGBUeXBlZC5MaXN0KCR7dGhpc1skdHlwZV1bJHR5cGVOYW1lXSgpfSlgXG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKHRoaXNbJHR5cGVOYW1lXSgpICsgJyhbJywgJ10pJylcbiAgfVxuXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gdGhpc1skc3RvcmVdLmhhcyhrZXkpXG4gIH1cblxuICBnZXQoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXNbJHN0b3JlXSA/IHRoaXNbJHN0b3JlXS5nZXQoaW5kZXgsIG5vdFNldFZhbHVlKSA6XG4gICAgICAgICAgIG5vdFNldFZhbHVlXG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHJldHVybiBjaGFuZ2UodGhpcywgY2xlYXIpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNbJGVtcHR5XSB8fCB0aGlzWyRyZWFkXSgpXG4gIH1cblxuICByZW1vdmUoaW5kZXgpIHtcbiAgICByZXR1cm4gY2hhbmdlKHRoaXMsIHN0b3JlID0+IHN0b3JlICYmIHN0b3JlLnJlbW92ZShpbmRleCkpXG4gIH1cblxuICBzZXQoaW5kZXgsIHZhbHVlKSB7XG4gICAgaWYgKGluZGV4ID4gdGhpcy5zaXplKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYEluZGV4IFwiJHtpbmRleH1cIiBpcyBvdXQgb2YgYm91bmRgKVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXNbJHR5cGVdWyRyZWFkXSh2YWx1ZSlcblxuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZTogJHtyZXN1bHQubWVzc2FnZX1gKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzWyRzdGVwXSh0aGlzLCBbaW5kZXgsIHJlc3VsdF0pXG4gIH1cblxuICBwdXNoKC4uLnZhbHVlcykge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzWyR0eXBlXVxuICAgIGNvbnN0IGl0ZW1zID0gW11cbiAgICBjb25zdCBjb3VudCA9IHZhbHVlcy5sZW5ndGhcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgd2hpbGUgKGluZGV4IDwgY291bnQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW2luZGV4XVxuICAgICAgY29uc3QgcmVzdWx0ID0gdHlwZVskcmVhZF0odmFsdWUpXG5cbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlOiAke3Jlc3VsdC5tZXNzYWdlfWApXG4gICAgICB9XG5cbiAgICAgIGl0ZW1zLnB1c2gocmVzdWx0KVxuICAgICAgaW5kZXggPSBpbmRleCArIDFcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhbmdlKHRoaXMsIHN0b3JlID0+XG4gICAgICBzdG9yZSA/IHN0b3JlLnB1c2goLi4uaXRlbXMpIDogSW1tdXRhYmxlTGlzdCguLi5pdGVtcykpXG4gIH1cbiAgcG9wKCkge1xuICAgIHJldHVybiBjaGFuZ2UodGhpcywgcG9wKVxuICB9XG4gIHVuc2hpZnQoLi4udmFsdWVzKSB7XG4gICAgY29uc3QgdHlwZSA9IHRoaXNbJHR5cGVdXG4gICAgY29uc3QgaXRlbXMgPSBbXVxuICAgIGNvbnN0IGNvdW50ID0gdmFsdWVzLmxlbmd0aFxuICAgIGxldCBpbmRleCA9IDBcblxuICAgIHdoaWxlIChpbmRleCA8IGNvdW50KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpbmRleF1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHR5cGVbJHJlYWRdKHZhbHVlKVxuXG4gICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZTogJHtyZXN1bHQubWVzc2FnZX1gKVxuICAgICAgfVxuXG4gICAgICBpdGVtcy5wdXNoKHJlc3VsdClcbiAgICAgIGluZGV4ID0gaW5kZXggKyAxXG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZSh0aGlzLCBzdG9yZSA9PlxuICAgICAgc3RvcmUgPyBzdG9yZS51bnNoaWZ0KC4uLml0ZW1zKSA6IEltbXV0YWJsZUxpc3QoLi4uaXRlbXMpKVxuICB9XG4gIHNoaWZ0KCkge1xuICAgIHJldHVybiBjaGFuZ2UodGhpcywgc2hpZnQpXG4gIH1cbiAgc2V0U2l6ZShzaXplKSB7XG4gICAgaWYgKHNpemUgPiB0aGlzLnNpemUpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcihgc2V0U2l6ZSBtYXkgb25seSBkb3duc2l6ZWApXG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5nZSh0aGlzLCBzdG9yZSA9PiBzdG9yZS5zZXRTaXplKHNpemUpKVxuICB9XG4gIHNsaWNlKGJlZ2luLCBlbmQpIHtcbiAgICByZXR1cm4gY2hhbmdlKHRoaXMsIHN0b3JlID0+IHN0b3JlICYmIHN0b3JlLnNsaWNlKGJlZ2luLCBlbmQpKVxuICB9XG5cbiAgd2FzQWx0ZXJlZCgpIHtcbiAgICByZXR1cm4gdGhpc1skc3RvcmVdLndhc0FsdGVyZWQoKVxuICB9XG5cbiAgX19lbnN1cmVPd25lcihvd25lcklEKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fX293bmVySUQgPT09IG93bmVySUQgPyB0aGlzIDpcbiAgICAgICAgICAgICAgICAgICAhb3duZXJJRCA/IHRoaXMgOlxuICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdCh0aGlzKVxuXG4gICAgcmVzdWx0Ll9fb3duZXJJRCA9IG93bmVySURcbiAgICByZXN1bHRbJHN0b3JlXSA9IHRoaXNbJHN0b3JlXSA/IHRoaXNbJHN0b3JlXS5fX2Vuc3VyZU93bmVyKG93bmVySUQpIDpcbiAgICAgICAgICAgICAgICAgICAgIEltbXV0YWJsZUxpc3QoKS5fX2Vuc3VyZU93bmVyKG93bmVySUQpXG4gICAgcmVzdWx0LnNpemUgPSByZXN1bHRbJHN0b3JlXS5zaXplXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIEluZGV4ZWQodGhpc1skc3RvcmVdKS5tYXAoKF8sIGtleSkgPT4gdGhpcy5nZXQoa2V5KSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKVxuICB9XG5cbiAgX19pdGVyYXRlKGYsIHJldmVyc2UpIHtcbiAgICByZXR1cm4gSW5kZXhlZCh0aGlzWyRzdG9yZV0pLm1hcCgoXywga2V5KSA9PiB0aGlzLmdldChrZXkpKS5fX2l0ZXJhdGUoZiwgcmV2ZXJzZSlcbiAgfVxufVxuVHlwZUluZmVyZWRMaXN0LnByb3RvdHlwZVtUeXBlZC5ERUxFVEVdID0gVHlwZUluZmVyZWRMaXN0LnByb3RvdHlwZS5yZW1vdmU7XG5cbmNvbnN0IEJhc2VUeXBlSW5mZXJlZExpc3QgPSBmdW5jdGlvbigpIHt9XG5CYXNlVHlwZUluZmVyZWRMaXN0LnByb3RvdHlwZSA9IFR5cGVJbmZlcmVkTGlzdC5wcm90b3R5cGVcblxuY2xhc3MgVHlwZWRMaXN0IGV4dGVuZHMgQmFzZVR5cGVJbmZlcmVkTGlzdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgfVxuICBbVHlwZWQuaW5pdF0oKSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdCh0aGlzKS5hc011dGFibGUoKVxuICB9XG4gIFtUeXBlZC5yZXN1bHRdKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQuYXNJbW11dGFibGUoKVxuICB9XG4gIG1hcChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBUeXBlSW5mZXJlZExpc3QuZnJvbSh0aGlzKS5tYXAobWFwcGVyLCBjb250ZXh0KVxuICAgICAgaWYgKHRoaXNbJHN0b3JlXSA9PT0gcmVzdWx0WyRzdG9yZV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHRbJHR5cGVdID09PSB0aGlzWyR0eXBlXSkge1xuICAgICAgICBjb25zdCBsaXN0ID0gY29uc3RydWN0KHRoaXMpXG4gICAgICAgIGxpc3RbJHN0b3JlXSA9IHJlc3VsdFskc3RvcmVdXG4gICAgICAgIGxpc3Quc2l6ZSA9IHJlc3VsdC5zaXplXG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBMaXN0ID0gZnVuY3Rpb24oZGVzY3JpcHRvciwgbGFiZWwpIHtcbiAgaWYgKGRlc2NyaXB0b3IgPT09IHZvaWQoMCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoXCJUeXBlZC5MaXN0IG11c3QgYmUgcGFzc2VkIGEgdHlwZSBkZXNjcmlwdG9yXCIpXG4gIH1cblxuICBpZiAoZGVzY3JpcHRvciA9PT0gQW55KSB7XG4gICAgcmV0dXJuIEltbXV0YWJsZS5MaXN0XG4gIH1cblxuICBjb25zdCB0eXBlID0gdHlwZU9mKGRlc2NyaXB0b3IpXG5cbiAgaWYgKHR5cGUgPT09IEFueSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIlR5cGVkLkxpc3Qgd2FzIHBhc3NlZCBhbiBpbnZhbGlkIHR5cGUgZGVzY3JpcHRvcjogJHtkZXNjcmlwdG9yfVwiKVxuICB9XG5cbiAgY29uc3QgTGlzdFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGNvbnN0IGlzTGlzdFR5cGUgPSB0aGlzIGluc3RhbmNlb2YgTGlzdFR5cGVcbiAgICBjb25zdCBUeXBlID0gaXNMaXN0VHlwZSA/IHRoaXMuY29uc3RydWN0b3IgOiBMaXN0VHlwZVxuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVHlwZSkge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gVHlwZS5wcm90b3R5cGVbJHJlYWRdKHZhbHVlKVxuXG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgdGhyb3cgcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gYGxpc3QubWFwKGYpYCB3aWxsIGluIGZhY3QgY2F1c2UgYGxpc3QuY29uc3RydWN0b3IoaXRlbXMpYCB0byBiZVxuICAgIC8vIGludm9rZWQgdGhlcmUgZm9yIHdlIG5lZWQgdG8gY2hlY2sgaWYgYHRoaXNbJHN0b3JlXWAgd2FzXG4gICAgLy8gYXNzaWduZWQgdG8ga25vdyBpZiBpdCdzIHRoYXQgb3IgaWYgaXQncyBhIGBuZXcgTGlzdFR5cGUoKWAgY2FsbC5cbiAgICBpZiAoaXNMaXN0VHlwZSAmJiAhdGhpc1skc3RvcmVdKSB7XG4gICAgICB0aGlzWyRzdG9yZV0gPSByZXN1bHRbJHN0b3JlXVxuICAgICAgdGhpcy5zaXplID0gcmVzdWx0LnNpemVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgTGlzdFR5cGUub2YgPSBJbW11dGFibGVMaXN0Lm9mXG4gIExpc3RUeXBlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTGlzdFByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7dmFsdWU6IExpc3RUeXBlfSxcbiAgICBbJHR5cGVdOiB7dmFsdWU6IHR5cGV9LFxuICAgIFskbGFiZWxdOiB7dmFsdWU6IGxhYmVsfVxuICB9KVxuXG4gIHJldHVybiBMaXN0VHlwZVxufVxuTGlzdC5UeXBlID0gVHlwZWRMaXN0XG5MaXN0LnByb3RvdHlwZSA9IFR5cGVkTGlzdC5wcm90b3R5cGVcbmNvbnN0IExpc3RQcm90b3R5cGUgPSBUeXBlZExpc3QucHJvdG90eXBlXG4iXX0=
