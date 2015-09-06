(function (global, factory) {
  factory(exports, require("./typed"), require('devtools/shared/content/immutable'));
})(this, function (exports, _typed, _immutable) {
  "use strict";

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  var ImmutableMap = _immutable.Map;
  var Keyed = _immutable.Iterable.Keyed;

  var $store = _typed.Typed.store;
  var $type = _typed.Typed.type;
  var $read = _typed.Typed.read;
  var $step = _typed.Typed.step;
  var $init = _typed.Typed.init;
  var $result = _typed.Typed.result;
  var $label = _typed.Typed.label;
  var $typeName = _typed.Typed.typeName;
  var $empty = _typed.Typed.empty;

  var EntryType = (function (_Type) {
    _inherits(EntryType, _Type);

    function EntryType(key, value, label) {
      _classCallCheck(this, EntryType);

      _get(Object.getPrototypeOf(EntryType.prototype), "constructor", this).call(this);
      this.key = key;
      this.value = value;
      this.label = label;
    }

    _createClass(EntryType, [{
      key: _typed.Typed.typeName,
      value: function value() {
        return this.label || this.key[$typeName]() + ", " + this.value[$typeName]();
      }
    }, {
      key: _typed.Typed.read,
      value: (function (_value) {
        function value(_x) {
          return _value.apply(this, arguments);
        }

        value.toString = function () {
          return _value.toString();
        };

        return value;
      })(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var value = _ref2[1];

        var keyResult = this.key[$read](key);
        if (keyResult instanceof TypeError) {
          return TypeError("Invalid key: " + keyResult.message);
        }

        var valueResult = this.value[$read](value);
        if (valueResult instanceof TypeError) {
          return TypeError("Invalid value: " + valueResult.message);
        }

        return [keyResult, valueResult];
      })
    }]);

    return EntryType;
  })(_typed.Type);

  var InferredEntryType = (function (_EntryType) {
    _inherits(InferredEntryType, _EntryType);

    function InferredEntryType() {
      _classCallCheck(this, InferredEntryType);

      _get(Object.getPrototypeOf(InferredEntryType.prototype), "constructor", this).call(this, key, value);
    }

    _createClass(InferredEntryType, [{
      key: "toStatic",
      value: function toStatic() {
        return new MapEntryType(this.key, this.value);
      }
    }, {
      key: _typed.Typed.typeName,
      value: function value() {
        var key = this.key ? this.key[$typeName]() : "TypeInferred";
        var value = this.value ? this.value[$typeName]() : "TypeInferred";
        return key + ", " + value;
      }
    }, {
      key: _typed.Typed.read,
      value: function value(entry) {
        // typeOf usually creates type for the value with that
        // value being a default. For type inference we should
        // actually use a base type instead of type with default
        // there for we use prototype of the constructor.
        var key = (0, _typed.typeOf)(entry[0]).constructor.prototype;
        this.key = this.key ? (0, _typed.Union)(this.key, key) : key;

        var value = (0, _typed.typeOf)(entry[1]).constructor.prototype;
        this.value = this.value ? (0, _typed.Union)(this.value, value) : value;

        return entry;
      }
    }]);

    return InferredEntryType;
  })(EntryType);

  var BaseImmutableMap = function BaseImmutableMap() {};
  BaseImmutableMap.prototype = _immutable.Map.prototype;

  var TypedMap = (function (_BaseImmutableMap) {
    _inherits(TypedMap, _BaseImmutableMap);

    function TypedMap(value) {
      _classCallCheck(this, TypedMap);

      _get(Object.getPrototypeOf(TypedMap.prototype), "constructor", this).call(this);
      return TypedMap.prototype[$read](value);
    }

    _createClass(TypedMap, [{
      key: "advance",
      value: function advance(store) {
        var result = store.__ownerID ? this : (0, _typed.construct)(this);
        result[$store] = store;
        result.size = store.size;
        result.__ownerID = store.__ownerID;
        return result;
      }
    }, {
      key: _typed.Typed.init,
      value: function value() {
        return this.advance(ImmutableMap()).asMutable();
      }
    }, {
      key: _typed.Typed.step,
      value: function value(state, entry) {
        var result = this[$type][$read](entry);

        if (result instanceof TypeError) {
          throw result;
        }

        var _result = _slicedToArray(result, 2);

        var key = _result[0];
        var value = _result[1];

        return state.advance(state[$store].set(key, value));
      }
    }, {
      key: _typed.Typed.result,
      value: function value(state) {
        return state.asImmutable();
      }
    }, {
      key: _typed.Typed.read,
      value: function value(structure) {
        var constructor = this.constructor;

        if (structure === null || structure === void 0) {
          if (!this[$empty]) {
            this[$empty] = this.advance(ImmutableMap());
          }

          return this[$empty];
        }

        var isInstance = structure instanceof constructor && structure.constructor === constructor;

        if (isInstance) {
          return structure;
        }

        var entries = Keyed(structure).entries();
        var type = this[$type];
        var state = this[$init]();

        while (true) {
          var _entries$next = entries.next();

          var done = _entries$next.done;
          var entry = _entries$next.value;

          if (done) {
            break;
          }

          var result = type[$read](entry);

          if (result instanceof TypeError) {
            return result;
          }

          state = state[$step](state, result);
        }

        return this[$result](state);
      }
    }, {
      key: _typed.Typed.typeName,
      value: function value() {
        return this[$label] || "Typed.Map(" + this[$type][$typeName]() + ")";
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.__toString(this[$typeName]() + '({', '})');
      }
    }, {
      key: "has",
      value: function has(key) {
        return this[$store].has(key);
      }
    }, {
      key: "get",
      value: function get(key, fallback) {
        return this[$store].get(key, fallback);
      }
    }, {
      key: "clear",
      value: function clear() {
        if (this.size === 0) {
          return this;
        }

        if (this.__ownerID) {
          return this.advance(this[$store].clear());
        }

        return this[$empty] || this[$read]();
      }
    }, {
      key: "remove",
      value: function remove(key) {
        return this.advance(this[$store].remove(key));
      }
    }, {
      key: "set",
      value: function set(key, value) {
        return this[$step](this, [key, value]);
      }
    }, {
      key: "wasAltered",
      value: function wasAltered() {
        return this[$store].wasAltered();
      }
    }, {
      key: "__ensureOwner",
      value: function __ensureOwner(ownerID) {
        var result = this.__ownerID === ownerID ? this : !ownerID ? this : (0, _typed.construct)(this);

        var store = this[$store].__ensureOwner(ownerID);
        result[$store] = store;
        result.size = store.size;
        result.__ownerID = ownerID;

        return result;
      }
    }, {
      key: "__iterator",
      value: function __iterator(type, reverse) {
        this[$store].__iterator(type, reverse);
      }
    }, {
      key: "__iterate",
      value: function __iterate(f, reverse) {
        this[$store].__iterate(f, reverse);
      }
    }]);

    return TypedMap;
  })(BaseImmutableMap);

  TypedMap.prototype[_typed.Typed.DELETE] = TypedMap.prototype.remove;

  var TypeInferredMap = (function (_TypedMap) {
    _inherits(TypeInferredMap, _TypedMap);

    function TypeInferredMap() {
      _classCallCheck(this, TypeInferredMap);

      _get(Object.getPrototypeOf(TypeInferredMap.prototype), "constructor", this).call(this);
    }

    _createClass(TypeInferredMap, [{
      key: _typed.Typed.init,
      value: function value() {
        var result = this.advance(ImmutableMap()).asMutable();
        result[$type] = new InferredEntryType();
        return result;
      }
    }, {
      key: _typed.Typed.result,
      value: function value(state) {
        var result = state.asImmutable();
        result[$type] = state[$type].toStatic();

        return result;
      }
    }]);

    return TypeInferredMap;
  })(TypedMap);

  var Map = function Map(keyDescriptor, valueDescriptor, label) {
    var _Object$create;

    if (keyDescriptor === void 0) {
      throw TypeError("Typed.Map must be passed a key type descriptor");
    }

    if (valueDescriptor === void 0) {
      throw TypeError("Typed.Map must be passed a value type descriptor");
    }

    // If both key and value types are Any this is just a plain immutable map.
    if (keyDescriptor === _typed.Any && valueDescriptor === _typed.Any) {
      return ImmutableMap;
    }

    var keyType = (0, _typed.typeOf)(keyDescriptor);
    var valueType = (0, _typed.typeOf)(valueDescriptor);

    if (keyType === _typed.Any && keyDescriptor !== _typed.Any) {
      throw TypeError("Typed.Map was passed an invalid key type descriptor: " + keyDescriptor);
    }

    if (valueType === _typed.Any && valueDescriptor !== _typed.Any) {
      throw TypeError("Typed.Map was passed an invalid value type descriptor: " + valueDescriptor);
    }

    var type = new EntryType(keyType, valueType, label);

    var MapType = function MapType(value) {
      var isThis = this instanceof MapType;
      var constructor = isThis ? this.constructor : MapType;

      if (value instanceof constructor) {
        return value;
      }

      var result = constructor.prototype[$read](value);

      if (result instanceof TypeError) {
        throw result;
      }

      var isCall = isThis && _typed.construct.prototype === this;

      if (!isCall && isThis) {
        this[$store] = result[$store];
        this.size = result.size;
      } else {
        return result;
      }

      return this;
    };
    MapType.prototype = Object.create(MapPrototype, (_Object$create = {
      constructor: { value: MapType }
    }, _defineProperty(_Object$create, $type, { value: type }), _defineProperty(_Object$create, $label, { value: label }), _Object$create));

    return MapType;
  };
  exports.Map = Map;
  Map.Type = TypedMap;
  Map.prototype = TypedMap.prototype;
  var MapPrototype = Map.prototype;
});
//# sourceMappingURL=data:application/json;base64,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QUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLG1DQUNyQixNQUFNLEVBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLG1CQUN4QixDQUFBOztBQUVGLFdBQU8sT0FBTyxDQUFBO0dBQ2YsQ0FBQTs7QUFDRCxLQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUNuQixLQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUE7QUFDbEMsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQSIsImZpbGUiOiJtYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGVkLCBUeXBlLCBVbmlvbiwgQW55LCB0eXBlT2YsIGNvbnN0cnVjdH0gZnJvbSBcIi4vdHlwZWRcIlxuaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcblxuXG5jb25zdCBJbW11dGFibGVNYXAgPSBJbW11dGFibGUuTWFwXG5jb25zdCB7S2V5ZWR9ID0gSW1tdXRhYmxlLkl0ZXJhYmxlXG5cbmNvbnN0ICRzdG9yZSA9IFR5cGVkLnN0b3JlXG5jb25zdCAkdHlwZSA9IFR5cGVkLnR5cGVcbmNvbnN0ICRyZWFkID0gVHlwZWQucmVhZFxuY29uc3QgJHN0ZXAgPSBUeXBlZC5zdGVwXG5jb25zdCAkaW5pdCA9IFR5cGVkLmluaXRcbmNvbnN0ICRyZXN1bHQgPSBUeXBlZC5yZXN1bHRcbmNvbnN0ICRsYWJlbCA9IFR5cGVkLmxhYmVsXG5jb25zdCAkdHlwZU5hbWUgPSBUeXBlZC50eXBlTmFtZVxuY29uc3QgJGVtcHR5ID0gVHlwZWQuZW1wdHlcblxuY2xhc3MgRW50cnlUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKGtleSwgdmFsdWUsIGxhYmVsKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMua2V5ID0ga2V5XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsXG4gIH1cbiAgW1R5cGVkLnR5cGVOYW1lXSgpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbCB8fFxuICAgICAgICAgICBgJHt0aGlzLmtleVskdHlwZU5hbWVdKCl9LCAke3RoaXMudmFsdWVbJHR5cGVOYW1lXSgpfWBcbiAgfVxuICBbVHlwZWQucmVhZF0oW2tleSwgdmFsdWVdKSB7XG4gICAgY29uc3Qga2V5UmVzdWx0ID0gdGhpcy5rZXlbJHJlYWRdKGtleSlcbiAgICBpZiAoa2V5UmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICByZXR1cm4gVHlwZUVycm9yKGBJbnZhbGlkIGtleTogJHtrZXlSZXN1bHQubWVzc2FnZX1gKVxuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlUmVzdWx0ID0gdGhpcy52YWx1ZVskcmVhZF0odmFsdWUpXG4gICAgaWYgKHZhbHVlUmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICByZXR1cm4gVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlOiAke3ZhbHVlUmVzdWx0Lm1lc3NhZ2V9YClcbiAgICB9XG5cbiAgICByZXR1cm4gW2tleVJlc3VsdCwgdmFsdWVSZXN1bHRdXG4gIH1cbn1cblxuY2xhc3MgSW5mZXJyZWRFbnRyeVR5cGUgZXh0ZW5kcyBFbnRyeVR5cGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihrZXksIHZhbHVlKVxuICB9XG4gIHRvU3RhdGljKCkge1xuICAgIHJldHVybiBuZXcgTWFwRW50cnlUeXBlKHRoaXMua2V5LCB0aGlzLnZhbHVlKVxuICB9XG4gIFtUeXBlZC50eXBlTmFtZV0oKSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5rZXkgPyB0aGlzLmtleVskdHlwZU5hbWVdKCkgOiBcIlR5cGVJbmZlcnJlZFwiXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZVskdHlwZU5hbWVdKCkgOiBcIlR5cGVJbmZlcnJlZFwiXG4gICAgcmV0dXJuIGAke2tleX0sICR7dmFsdWV9YFxuICB9XG4gIFtUeXBlZC5yZWFkXShlbnRyeSkge1xuICAgIC8vIHR5cGVPZiB1c3VhbGx5IGNyZWF0ZXMgdHlwZSBmb3IgdGhlIHZhbHVlIHdpdGggdGhhdFxuICAgIC8vIHZhbHVlIGJlaW5nIGEgZGVmYXVsdC4gRm9yIHR5cGUgaW5mZXJlbmNlIHdlIHNob3VsZFxuICAgIC8vIGFjdHVhbGx5IHVzZSBhIGJhc2UgdHlwZSBpbnN0ZWFkIG9mIHR5cGUgd2l0aCBkZWZhdWx0XG4gICAgLy8gdGhlcmUgZm9yIHdlIHVzZSBwcm90b3R5cGUgb2YgdGhlIGNvbnN0cnVjdG9yLlxuICAgIGNvbnN0IGtleSA9IHR5cGVPZihlbnRyeVswXSkuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgdGhpcy5rZXkgPSB0aGlzLmtleSA/IFVuaW9uKHRoaXMua2V5LCBrZXkpIDoga2V5XG5cbiAgICBjb25zdCB2YWx1ZSA9IHR5cGVPZihlbnRyeVsxXSkuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUgPyBVbmlvbih0aGlzLnZhbHVlLCB2YWx1ZSkgOiB2YWx1ZVxuXG4gICAgcmV0dXJuIGVudHJ5XG4gIH1cbn1cblxuY29uc3QgQmFzZUltbXV0YWJsZU1hcCA9IGZ1bmN0aW9uKCkge31cbkJhc2VJbW11dGFibGVNYXAucHJvdG90eXBlID0gSW1tdXRhYmxlLk1hcC5wcm90b3R5cGVcblxuY2xhc3MgVHlwZWRNYXAgZXh0ZW5kcyBCYXNlSW1tdXRhYmxlTWFwIHtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBzdXBlcigpXG4gICAgcmV0dXJuIFR5cGVkTWFwLnByb3RvdHlwZVskcmVhZF0odmFsdWUpXG4gIH1cbiAgYWR2YW5jZShzdG9yZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN0b3JlLl9fb3duZXJJRCA/IHRoaXMgOiBjb25zdHJ1Y3QodGhpcylcbiAgICByZXN1bHRbJHN0b3JlXSA9IHN0b3JlXG4gICAgcmVzdWx0LnNpemUgPSBzdG9yZS5zaXplXG4gICAgcmVzdWx0Ll9fb3duZXJJRCA9IHN0b3JlLl9fb3duZXJJRFxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICBbVHlwZWQuaW5pdF0oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWR2YW5jZShJbW11dGFibGVNYXAoKSkuYXNNdXRhYmxlKClcbiAgfVxuICBbVHlwZWQuc3RlcF0oc3RhdGUsIGVudHJ5KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpc1skdHlwZV1bJHJlYWRdKGVudHJ5KVxuXG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgdGhyb3cgcmVzdWx0XG4gICAgfVxuXG4gICAgY29uc3QgW2tleSwgdmFsdWVdID0gcmVzdWx0XG4gICAgcmV0dXJuIHN0YXRlLmFkdmFuY2Uoc3RhdGVbJHN0b3JlXS5zZXQoa2V5LCB2YWx1ZSkpXG4gIH1cbiAgW1R5cGVkLnJlc3VsdF0oc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGUuYXNJbW11dGFibGUoKVxuICB9XG5cbiAgW1R5cGVkLnJlYWRdKHN0cnVjdHVyZSkge1xuICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvclxuXG4gICAgaWYgKHN0cnVjdHVyZSA9PT0gbnVsbCB8fCBzdHJ1Y3R1cmUgPT09IHZvaWQoMCkpIHtcbiAgICAgIGlmICghdGhpc1skZW1wdHldKSB7XG4gICAgICAgIHRoaXNbJGVtcHR5XSA9IHRoaXMuYWR2YW5jZShJbW11dGFibGVNYXAoKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNbJGVtcHR5XVxuICAgIH1cblxuICAgIGNvbnN0IGlzSW5zdGFuY2UgPSBzdHJ1Y3R1cmUgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICBzdHJ1Y3R1cmUuY29uc3RydWN0b3IgPT09IGNvbnN0cnVjdG9yXG5cbiAgICBpZiAoaXNJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHN0cnVjdHVyZVxuICAgIH1cblxuXG4gICAgY29uc3QgZW50cmllcyA9IEtleWVkKHN0cnVjdHVyZSkuZW50cmllcygpXG4gICAgY29uc3QgdHlwZSA9IHRoaXNbJHR5cGVdXG4gICAgbGV0IHN0YXRlID0gdGhpc1skaW5pdF0oKVxuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHtkb25lLCB2YWx1ZTogZW50cnl9ID0gZW50cmllcy5uZXh0KClcblxuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdHlwZVskcmVhZF0oZW50cnkpXG5cbiAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuXG4gICAgICBzdGF0ZSA9IHN0YXRlWyRzdGVwXShzdGF0ZSwgcmVzdWx0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzWyRyZXN1bHRdKHN0YXRlKVxuICB9XG5cbiAgW1R5cGVkLnR5cGVOYW1lXSgpIHtcbiAgICByZXR1cm4gdGhpc1skbGFiZWxdIHx8IGBUeXBlZC5NYXAoJHt0aGlzWyR0eXBlXVskdHlwZU5hbWVdKCl9KWBcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcodGhpc1skdHlwZU5hbWVdKCkgKyAnKHsnLCAnfSknKVxuICB9XG5cbiAgaGFzKGtleSkge1xuICAgIHJldHVybiB0aGlzWyRzdG9yZV0uaGFzKGtleSlcbiAgfVxuXG4gIGdldChrZXksIGZhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXNbJHN0b3JlXS5nZXQoa2V5LCBmYWxsYmFjaylcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcy5hZHZhbmNlKHRoaXNbJHN0b3JlXS5jbGVhcigpKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzWyRlbXB0eV0gfHwgdGhpc1skcmVhZF0oKVxuICB9XG5cbiAgcmVtb3ZlKGtleSkge1xuICAgIHJldHVybiB0aGlzLmFkdmFuY2UodGhpc1skc3RvcmVdLnJlbW92ZShrZXkpKVxuICB9XG5cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1skc3RlcF0odGhpcywgW2tleSwgdmFsdWVdKVxuICB9XG5cbiAgd2FzQWx0ZXJlZCgpIHtcbiAgICByZXR1cm4gdGhpc1skc3RvcmVdLndhc0FsdGVyZWQoKVxuICB9XG5cbiAgX19lbnN1cmVPd25lcihvd25lcklEKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fX293bmVySUQgPT09IG93bmVySUQgPyB0aGlzIDpcbiAgICAgICAgICAgICAgICAgICAhb3duZXJJRCA/IHRoaXMgOlxuICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdCh0aGlzKVxuXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzWyRzdG9yZV0uX19lbnN1cmVPd25lcihvd25lcklEKVxuICAgIHJlc3VsdFskc3RvcmVdID0gc3RvcmVcbiAgICByZXN1bHQuc2l6ZSA9IHN0b3JlLnNpemVcbiAgICByZXN1bHQuX19vd25lcklEID0gb3duZXJJRFxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSkge1xuICAgIHRoaXNbJHN0b3JlXS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpXG4gIH1cblxuICBfX2l0ZXJhdGUoZiwgcmV2ZXJzZSkge1xuICAgIHRoaXNbJHN0b3JlXS5fX2l0ZXJhdGUoZiwgcmV2ZXJzZSlcbiAgfVxufVxuVHlwZWRNYXAucHJvdG90eXBlW1R5cGVkLkRFTEVURV0gPSBUeXBlZE1hcC5wcm90b3R5cGUucmVtb3ZlXG5cbmNsYXNzIFR5cGVJbmZlcnJlZE1hcCBleHRlbmRzIFR5cGVkTWFwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICB9XG4gIFtUeXBlZC5pbml0XSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFkdmFuY2UoSW1tdXRhYmxlTWFwKCkpLmFzTXV0YWJsZSgpXG4gICAgcmVzdWx0WyR0eXBlXSA9IG5ldyBJbmZlcnJlZEVudHJ5VHlwZSgpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIFtUeXBlZC5yZXN1bHRdKHN0YXRlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYXNJbW11dGFibGUoKVxuICAgIHJlc3VsdFskdHlwZV0gPSBzdGF0ZVskdHlwZV0udG9TdGF0aWMoKVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBNYXAgPSBmdW5jdGlvbihrZXlEZXNjcmlwdG9yLCB2YWx1ZURlc2NyaXB0b3IsIGxhYmVsKSB7XG4gIGlmIChrZXlEZXNjcmlwdG9yID09PSB2b2lkKDApKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiVHlwZWQuTWFwIG11c3QgYmUgcGFzc2VkIGEga2V5IHR5cGUgZGVzY3JpcHRvclwiKVxuICB9XG5cbiAgaWYgKHZhbHVlRGVzY3JpcHRvciA9PT0gdm9pZCgwKSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIlR5cGVkLk1hcCBtdXN0IGJlIHBhc3NlZCBhIHZhbHVlIHR5cGUgZGVzY3JpcHRvclwiKVxuICB9XG5cbiAgLy8gSWYgYm90aCBrZXkgYW5kIHZhbHVlIHR5cGVzIGFyZSBBbnkgdGhpcyBpcyBqdXN0IGEgcGxhaW4gaW1tdXRhYmxlIG1hcC5cbiAgaWYgKGtleURlc2NyaXB0b3IgPT09IEFueSAmJiB2YWx1ZURlc2NyaXB0b3IgPT09IEFueSkge1xuICAgIHJldHVybiBJbW11dGFibGVNYXBcbiAgfVxuXG4gIGNvbnN0IGtleVR5cGUgPSB0eXBlT2Yoa2V5RGVzY3JpcHRvcilcbiAgY29uc3QgdmFsdWVUeXBlID0gdHlwZU9mKHZhbHVlRGVzY3JpcHRvcilcblxuICBpZiAoa2V5VHlwZSA9PT0gQW55ICYmIGtleURlc2NyaXB0b3IgIT09IEFueSkge1xuICAgIHRocm93IFR5cGVFcnJvcihgVHlwZWQuTWFwIHdhcyBwYXNzZWQgYW4gaW52YWxpZCBrZXkgdHlwZSBkZXNjcmlwdG9yOiAke2tleURlc2NyaXB0b3J9YClcbiAgfVxuXG4gIGlmICh2YWx1ZVR5cGUgPT09IEFueSAmJiB2YWx1ZURlc2NyaXB0b3IgIT09IEFueSkge1xuICAgIHRocm93IFR5cGVFcnJvcihgVHlwZWQuTWFwIHdhcyBwYXNzZWQgYW4gaW52YWxpZCB2YWx1ZSB0eXBlIGRlc2NyaXB0b3I6ICR7dmFsdWVEZXNjcmlwdG9yfWApXG4gIH1cblxuICBjb25zdCB0eXBlID0gbmV3IEVudHJ5VHlwZShrZXlUeXBlLCB2YWx1ZVR5cGUsIGxhYmVsKVxuXG4gIGNvbnN0IE1hcFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGNvbnN0IGlzVGhpcyA9IHRoaXMgaW5zdGFuY2VvZiBNYXBUeXBlXG4gICAgY29uc3QgY29uc3RydWN0b3IgPSBpc1RoaXMgPyB0aGlzLmNvbnN0cnVjdG9yIDogTWFwVHlwZVxuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgY29uc3RydWN0b3IpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZVskcmVhZF0odmFsdWUpXG5cbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICB0aHJvdyByZXN1bHRcbiAgICB9XG5cbiAgICBjb25zdCBpc0NhbGwgPSBpc1RoaXMgJiYgY29uc3RydWN0LnByb3RvdHlwZSA9PT0gdGhpc1xuXG4gICAgaWYgKCFpc0NhbGwgJiYgaXNUaGlzKSB7XG4gICAgICB0aGlzWyRzdG9yZV0gPSByZXN1bHRbJHN0b3JlXVxuICAgICAgdGhpcy5zaXplID0gcmVzdWx0LnNpemVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgTWFwVHlwZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKE1hcFByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7dmFsdWU6IE1hcFR5cGV9LFxuICAgIFskdHlwZV06IHt2YWx1ZTogdHlwZX0sXG4gICAgWyRsYWJlbF06IHt2YWx1ZTogbGFiZWx9XG4gIH0pXG5cbiAgcmV0dXJuIE1hcFR5cGVcbn1cbk1hcC5UeXBlID0gVHlwZWRNYXBcbk1hcC5wcm90b3R5cGUgPSBUeXBlZE1hcC5wcm90b3R5cGVcbmNvbnN0IE1hcFByb3RvdHlwZSA9IE1hcC5wcm90b3R5cGVcbiJdfQ==
