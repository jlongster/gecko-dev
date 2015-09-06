(function (global, factory) {
  factory(exports, require("./typed"), require('devtools/shared/content/immutable'));
})(this, function (exports, _typed, _immutable) {
  "use strict";

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  var Keyed = _immutable.Iterable.Keyed;

  var Getter = function Getter(key) {
    return function () {
      return this.get(key);
    };
  };

  var Setter = function Setter(key) {
    return function (value) {
      if (!this.__ownerID) {
        throw TypeError("Cannot set on an immutable record.");
      }
      this.set(key, value);
    };
  };

  var $store = _typed.Typed.store;
  var $type = _typed.Typed.type;
  var $step = _typed.Typed.step;
  var $init = _typed.Typed.init;
  var $result = _typed.Typed.result;
  var $read = _typed.Typed.read;
  var $label = _typed.Typed.label;
  var $empty = _typed.Typed.empty;
  var $typeName = _typed.Typed.typeName;
  var $typeSignature = _typed.Typed.typeSignature;

  var IterableKeyedBase = function IterableKeyedBase() {};
  IterableKeyedBase.prototype = _immutable.Iterable.Keyed.prototype;

  var TypedRecord = (function (_IterableKeyedBase) {
    _inherits(TypedRecord, _IterableKeyedBase);

    function TypedRecord() {
      _classCallCheck(this, TypedRecord);

      _get(Object.getPrototypeOf(TypedRecord.prototype), "constructor", this).call(this);
    }

    _createClass(TypedRecord, [{
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
      key: _typed.Typed.read,
      value: function value(structure) {
        var Type = this.constructor;

        if (structure instanceof Type && structure && structure.constructor === Type) {
          return structure;
        }

        if (structure === null || structure && typeof structure !== "object") {
          return TypeError("Invalid data structure \"" + structure + "\" was passed to " + this[$typeName]());
        }

        var seq = (0, _immutable.Seq)(structure);
        var type = this[$type];
        var isEmpty = seq.size === 0;

        if (isEmpty && this[$empty]) {
          return this[$empty];
        }

        var record = undefined;
        for (var key in type) {
          var fieldType = type[key];
          var value = seq.has(key) ? seq.get(key) : this.get(key);
          var result = fieldType[$read](value);

          if (result instanceof TypeError) {
            return TypeError("Invalid value for \"" + key + "\" field:\n " + result.message);
          }

          record = this[$step](record || this[$init](), [key, result]);
        }

        record = this[$result](record);

        if (isEmpty) {
          this[$empty] = record;
        }

        return record;
      }
    }, {
      key: _typed.Typed.step,
      value: function value(result, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var _value = _ref2[1];

        var store = result[$store] ? result[$store].set(key, _value) : new _immutable.Map([[key, _value]]);

        if (result[$store] === store) {
          return result;
        }

        var record = result.__ownerID ? result : (0, _typed.construct)(result);
        record[$store] = store;

        return record;
      }
    }, {
      key: _typed.Typed.typeSignature,
      value: function value() {
        var type = this[$type];
        var body = [];
        for (var key in type) {
          body.push(key + ": " + type[key][$typeName]());
        }

        return "Typed.Record({" + body.join(', ') + "})";
      }
    }, {
      key: _typed.Typed.typeName,
      value: function value() {
        return this[$label] || this[$typeSignature]();
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.__toString(this[$typeName]() + '({', '})');
      }
    }, {
      key: "has",
      value: function has(key) {
        return !!this[$type][key];
      }
    }, {
      key: "get",
      value: function get(key, defaultValue) {
        return !this[$type][key] ? defaultValue : !this[$store] ? defaultValue : this[$store].get(key, defaultValue);
      }
    }, {
      key: "clear",
      value: function clear() {
        if (this.__ownerID) {
          this[$store] && this[$store].clear();
          return this;
        }

        return this[$empty] || (this[$empty] = new this.constructor());
      }
    }, {
      key: "remove",
      value: function remove(key) {
        return this[$type][key] ? this.set(key, void 0) : this;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        var fieldType = this[$type][key];

        if (!fieldType) {
          throw TypeError("Cannot set unknown field \"" + key + "\" on \"" + this[$typeName]() + "\"");
        }

        var result = fieldType[$read](value);

        if (result instanceof TypeError) {
          throw TypeError("Invalid value for " + key + " field: " + result.message);
        }

        return this[$step](this, [key, result]);
      }
    }, {
      key: "__iterator",
      value: function __iterator(type, reverse) {
        var _this = this;

        return Keyed(this[$type]).map(function (_, key) {
          return _this.get(key);
        }).__iterator(type, reverse);
      }
    }, {
      key: "__iterate",
      value: function __iterate(f, reverse) {
        var _this2 = this;

        return Keyed(this[$type]).map(function (_, key) {
          return _this2.get(key);
        }).__iterate(f, reverse);
      }
    }, {
      key: "__ensureOwner",
      value: function __ensureOwner(ownerID) {
        if (ownerID === this.__ownerID) {
          return this;
        }

        var store = this[$store] && this[$store].__ensureOwner(ownerID);
        var result = !ownerID ? this : (0, _typed.construct)(this);

        result.__ownerID = ownerID;
        result[$store] = store;
        return result;
      }
    }, {
      key: "wasAltered",
      value: function wasAltered() {
        return this[$store].wasAltered();
      }
    }]);

    return TypedRecord;
  })(IterableKeyedBase);

  var Record = function Record(descriptor, label) {
    if (descriptor && typeof descriptor === "object") {
      var type = Object.create(null);
      var _keys = Object.keys(descriptor);
      var size = _keys.length;

      if (size > 0) {
        var _properties;

        var _ret = (function () {
          var properties = (_properties = {
            size: { value: size }
          }, _defineProperty(_properties, $type, { value: type }), _defineProperty(_properties, $label, { value: label }), _properties);

          var index = 0;
          while (index < size) {
            var key = _keys[index];
            var fieldType = (0, _typed.typeOf)(descriptor[key]);

            if (fieldType) {
              type[key] = fieldType;
              properties[key] = { get: Getter(key), set: Setter(key), enumerable: true };
            } else {
              throw TypeError("Invalid field descriptor provided for a \"" + key + "\" field");
            }

            index = index + 1;
          }

          var RecordType = function RecordType(structure) {
            var isNew = this instanceof RecordType;
            var constructor = isNew ? this.constructor : RecordType;

            if (structure instanceof constructor) {
              return structure;
            }

            var type = constructor.prototype;
            var result = type[$read](structure);

            if (result instanceof TypeError) {
              throw result;
            }

            if (isNew) {
              this[$store] = result[$store];
            } else {
              return result;
            }
          };

          properties.constructor = { value: RecordType };
          RecordType.prototype = Object.create(RecordPrototype, properties);
          var prototype = RecordType.prototype;

          return {
            v: RecordType
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      } else {
        throw TypeError("Typed.Record descriptor must define at least on field");
      }
    } else {
      throw TypeError("Typed.Record must be passed a descriptor of fields");
    }
  };
  exports.Record = Record;
  Record.Type = TypedRecord;
  Record.prototype = TypedRecord.prototype;
  var RecordPrototype = TypedRecord.prototype;

  RecordPrototype[_typed.Typed.DELETE] = RecordPrototype.remove;

  // Large part of the Record API is implemented by Immutabel.Map
  // and is just copied over.
  RecordPrototype.deleteIn = _immutable.Map.prototype.deleteIn;
  RecordPrototype.removeIn = _immutable.Map.prototype.removeIn;
  RecordPrototype.merge = _immutable.Map.prototype.merge;
  RecordPrototype.mergeWith = _immutable.Map.prototype.mergeWith;
  RecordPrototype.mergeIn = _immutable.Map.prototype.mergeIn;
  RecordPrototype.mergeDeep = _immutable.Map.prototype.mergeDeep;
  RecordPrototype.mergeDeepWith = _immutable.Map.prototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = _immutable.Map.prototype.mergeDeepIn;
  RecordPrototype.setIn = _immutable.Map.prototype.setIn;
  RecordPrototype.update = _immutable.Map.prototype.update;
  RecordPrototype.updateIn = _immutable.Map.prototype.updateIn;
  RecordPrototype.withMutations = _immutable.Map.prototype.withMutations;
  RecordPrototype.asMutable = _immutable.Map.prototype.asMutable;
  RecordPrototype.asImmutable = _immutable.Map.prototype.asImmutable;

  // Large chuck of API inherited from Iterable does not makes
  // much sense in the context of records so we undefine it.
  RecordPrototype.map = void 0;
  RecordPrototype.filter = void 0;
  RecordPrototype.filterNot = void 0;
  RecordPrototype.flip = void 0;
  RecordPrototype.mapKeys = void 0;
  RecordPrototype.mapEntries = void 0;
  RecordPrototype.sort = void 0;
  RecordPrototype.sortBy = void 0;
  RecordPrototype.reverse = void 0;
  RecordPrototype.slice = void 0;
  RecordPrototype.butLast = void 0;
  RecordPrototype.flatMap = void 0;
  RecordPrototype.flatten = void 0;
  RecordPrototype.rest = void 0;
  RecordPrototype.skip = void 0;
  RecordPrototype.skipLast = void 0;
  RecordPrototype.skipWhile = void 0;
  RecordPrototype.skipUntil = void 0;
  RecordPrototype.sortBy = void 0;
  RecordPrototype.take = void 0;
  RecordPrototype.takeLast = void 0;
  RecordPrototype.takeWhile = void 0;
  RecordPrototype.takeUntil = void 0;
});
//# sourceMappingURL=data:application/json;base64,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QWUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEFBQUMsQ0FBQTtBQUM5QixpQkFBZSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQUFBQyxDQUFBO0FBQzlCLGlCQUFlLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxBQUFDLENBQUE7QUFDbEMsaUJBQWUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEFBQUMsQ0FBQTtBQUNuQyxpQkFBZSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQUFBQyxDQUFBO0FBQ25DLGlCQUFlLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxBQUFDLENBQUE7QUFDaEMsaUJBQWUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEFBQUMsQ0FBQTtBQUM5QixpQkFBZSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQUFBQyxDQUFBO0FBQ2xDLGlCQUFlLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxBQUFDLENBQUE7QUFDbkMsaUJBQWUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEFBQUMsQ0FBQSIsImZpbGUiOiJyZWNvcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGVkLCB0eXBlT2YsIGNvbnN0cnVjdH0gZnJvbSBcIi4vdHlwZWRcIlxuaW1wb3J0IHtTZXEsIEl0ZXJhYmxlLCBNYXB9IGZyb20gJ2ltbXV0YWJsZSdcblxuY29uc3Qge0tleWVkfSA9IEl0ZXJhYmxlXG5cbmNvbnN0IEdldHRlciA9IGtleSA9PiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0KGtleSlcbn1cblxuY29uc3QgU2V0dGVyID0ga2V5ID0+IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghdGhpcy5fX293bmVySUQpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoXCJDYW5ub3Qgc2V0IG9uIGFuIGltbXV0YWJsZSByZWNvcmQuXCIpXG4gIH1cbiAgdGhpcy5zZXQoa2V5LCB2YWx1ZSlcbn1cblxuXG5jb25zdCAkc3RvcmUgPSBUeXBlZC5zdG9yZVxuY29uc3QgJHR5cGUgPSBUeXBlZC50eXBlXG5jb25zdCAkc3RlcCA9IFR5cGVkLnN0ZXBcbmNvbnN0ICRpbml0ID0gVHlwZWQuaW5pdFxuY29uc3QgJHJlc3VsdCA9IFR5cGVkLnJlc3VsdFxuY29uc3QgJHJlYWQgPSBUeXBlZC5yZWFkXG5jb25zdCAkbGFiZWwgPSBUeXBlZC5sYWJlbFxuY29uc3QgJGVtcHR5ID0gVHlwZWQuZW1wdHlcbmNvbnN0ICR0eXBlTmFtZSA9IFR5cGVkLnR5cGVOYW1lXG5jb25zdCAkdHlwZVNpZ25hdHVyZSA9IFR5cGVkLnR5cGVTaWduYXR1cmVcblxuY29uc3QgSXRlcmFibGVLZXllZEJhc2UgPSBmdW5jdGlvbigpIHt9XG5JdGVyYWJsZUtleWVkQmFzZS5wcm90b3R5cGUgPSBJdGVyYWJsZS5LZXllZC5wcm90b3R5cGVcblxuXG5jbGFzcyBUeXBlZFJlY29yZCBleHRlbmRzIEl0ZXJhYmxlS2V5ZWRCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICB9XG4gIFtUeXBlZC5pbml0XSgpIHtcbiAgICByZXR1cm4gY29uc3RydWN0KHRoaXMpLmFzTXV0YWJsZSgpXG4gIH1cbiAgW1R5cGVkLnJlc3VsdF0ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdC5hc0ltbXV0YWJsZSgpXG4gIH1cblxuICBbVHlwZWQucmVhZF0oc3RydWN0dXJlKSB7XG4gICAgY29uc3QgVHlwZSA9IHRoaXMuY29uc3RydWN0b3JcblxuICAgIGlmIChzdHJ1Y3R1cmUgaW5zdGFuY2VvZiBUeXBlICYmXG4gICAgICAgIHN0cnVjdHVyZSAmJlxuICAgICAgICBzdHJ1Y3R1cmUuY29uc3RydWN0b3IgPT09IFR5cGUpIHtcbiAgICAgIHJldHVybiBzdHJ1Y3R1cmVcbiAgICB9XG5cbiAgICBpZiAoc3RydWN0dXJlID09PSBudWxsIHx8IChzdHJ1Y3R1cmUgJiYgdHlwZW9mKHN0cnVjdHVyZSkgIT09IFwib2JqZWN0XCIpKSB7XG4gICAgICByZXR1cm4gVHlwZUVycm9yKGBJbnZhbGlkIGRhdGEgc3RydWN0dXJlIFwiJHtzdHJ1Y3R1cmV9XCIgd2FzIHBhc3NlZCB0byAke3RoaXNbJHR5cGVOYW1lXSgpfWApXG4gICAgfVxuXG4gICAgY29uc3Qgc2VxID0gU2VxKHN0cnVjdHVyZSlcbiAgICBjb25zdCB0eXBlID0gdGhpc1skdHlwZV1cbiAgICBjb25zdCBpc0VtcHR5ID0gc2VxLnNpemUgPT09IDBcblxuXG4gICAgaWYgKGlzRW1wdHkgJiYgdGhpc1skZW1wdHldKSB7XG4gICAgICByZXR1cm4gdGhpc1skZW1wdHldXG4gICAgfVxuXG4gICAgbGV0IHJlY29yZFxuICAgIGZvciAobGV0IGtleSBpbiB0eXBlKSB7XG4gICAgICBjb25zdCBmaWVsZFR5cGUgPSB0eXBlW2tleV1cbiAgICAgIGNvbnN0IHZhbHVlID0gc2VxLmhhcyhrZXkpID8gc2VxLmdldChrZXkpIDogdGhpcy5nZXQoa2V5KVxuICAgICAgY29uc3QgcmVzdWx0ID0gZmllbGRUeXBlWyRyZWFkXSh2YWx1ZSlcblxuICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICByZXR1cm4gVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBcIiR7a2V5fVwiIGZpZWxkOlxcbiAke3Jlc3VsdC5tZXNzYWdlfWApXG4gICAgICB9XG5cbiAgICAgIHJlY29yZCA9IHRoaXNbJHN0ZXBdKHJlY29yZCB8fCB0aGlzWyRpbml0XSgpLCBba2V5LCByZXN1bHRdKVxuICAgIH1cblxuICAgIHJlY29yZCA9IHRoaXNbJHJlc3VsdF0ocmVjb3JkKVxuXG4gICBpZiAoaXNFbXB0eSkge1xuICAgICAgdGhpc1skZW1wdHldID0gcmVjb3JkXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlY29yZFxuICB9XG4gIFtUeXBlZC5zdGVwXShyZXN1bHQsIFtrZXksIHZhbHVlXSkge1xuICAgIGNvbnN0IHN0b3JlID0gcmVzdWx0WyRzdG9yZV0gPyByZXN1bHRbJHN0b3JlXS5zZXQoa2V5LCB2YWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgbmV3IE1hcChbW2tleSwgdmFsdWVdXSlcblxuICAgIGlmIChyZXN1bHRbJHN0b3JlXSA9PT0gc3RvcmUpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjb3JkID0gcmVzdWx0Ll9fb3duZXJJRCA/IHJlc3VsdCA6IGNvbnN0cnVjdChyZXN1bHQpXG4gICAgcmVjb3JkWyRzdG9yZV0gPSBzdG9yZVxuXG4gICAgcmV0dXJuIHJlY29yZFxuICB9XG5cbiAgW1R5cGVkLnR5cGVTaWduYXR1cmVdKCkge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzWyR0eXBlXVxuICAgIGNvbnN0IGJvZHkgPSBbXVxuICAgIGZvciAobGV0IGtleSBpbiB0eXBlKSB7XG4gICAgICBib2R5LnB1c2goYCR7a2V5fTogJHt0eXBlW2tleV1bJHR5cGVOYW1lXSgpfWApXG4gICAgfVxuXG4gICAgcmV0dXJuIGBUeXBlZC5SZWNvcmQoeyR7Ym9keS5qb2luKCcsICcpfX0pYFxuICB9XG5cbiAgW1R5cGVkLnR5cGVOYW1lXSgpIHtcbiAgICByZXR1cm4gdGhpc1skbGFiZWxdIHx8IHRoaXNbJHR5cGVTaWduYXR1cmVdKClcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcodGhpc1skdHlwZU5hbWVdKCkgKyAnKHsnLCAnfSknKVxuICB9XG5cbiAgaGFzKGtleSkge1xuICAgIHJldHVybiAhIXRoaXNbJHR5cGVdW2tleV1cbiAgfVxuXG4gIGdldChrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiAhdGhpc1skdHlwZV1ba2V5XSA/IGRlZmF1bHRWYWx1ZSA6XG4gICAgICAgICAgICF0aGlzWyRzdG9yZV0gPyBkZWZhdWx0VmFsdWUgOlxuICAgICAgICAgICB0aGlzWyRzdG9yZV0uZ2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpc1skc3RvcmVdICYmIHRoaXNbJHN0b3JlXS5jbGVhcigpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzWyRlbXB0eV0gfHxcbiAgICAgICAgICAgKHRoaXNbJGVtcHR5XSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKCkpXG4gIH1cblxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbJHR5cGVdW2tleV0gPyB0aGlzLnNldChrZXksIHZvaWQoMCkpIDogdGhpc1xuICB9XG5cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCBmaWVsZFR5cGUgPSB0aGlzWyR0eXBlXVtrZXldXG5cbiAgICBpZiAoIWZpZWxkVHlwZSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGBDYW5ub3Qgc2V0IHVua25vd24gZmllbGQgXCIke2tleX1cIiBvbiBcIiR7dGhpc1skdHlwZU5hbWVdKCl9XCJgKVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGZpZWxkVHlwZVskcmVhZF0odmFsdWUpXG5cbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yICR7a2V5fSBmaWVsZDogJHtyZXN1bHQubWVzc2FnZX1gKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzWyRzdGVwXSh0aGlzLCBba2V5LCByZXN1bHRdKVxuICB9XG4gIF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiBLZXllZCh0aGlzWyR0eXBlXSkubWFwKChfLCBrZXkpID0+IHRoaXMuZ2V0KGtleSkpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gIH1cblxuICBfX2l0ZXJhdGUoZiwgcmV2ZXJzZSkge1xuICAgIHJldHVybiBLZXllZCh0aGlzWyR0eXBlXSkubWFwKChfLCBrZXkpID0+IHRoaXMuZ2V0KGtleSkpLl9faXRlcmF0ZShmLCByZXZlcnNlKTtcbiAgfVxuXG4gIF9fZW5zdXJlT3duZXIob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yZSA9IHRoaXNbJHN0b3JlXSAmJiB0aGlzWyRzdG9yZV0uX19lbnN1cmVPd25lcihvd25lcklEKVxuICAgIGNvbnN0IHJlc3VsdCA9ICFvd25lcklEID8gdGhpcyA6IGNvbnN0cnVjdCh0aGlzKVxuXG4gICAgcmVzdWx0Ll9fb3duZXJJRCA9IG93bmVySURcbiAgICByZXN1bHRbJHN0b3JlXSA9IHN0b3JlXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG4gIHdhc0FsdGVyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXNbJHN0b3JlXS53YXNBbHRlcmVkKClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUmVjb3JkID0gZnVuY3Rpb24oZGVzY3JpcHRvciwgbGFiZWwpIHtcbiAgaWYgKGRlc2NyaXB0b3IgJiYgdHlwZW9mKGRlc2NyaXB0b3IpID09PSBcIm9iamVjdFwiKSB7XG4gICAgY29uc3QgdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGVzY3JpcHRvcilcbiAgICBjb25zdCBzaXplID0ga2V5cy5sZW5ndGhcblxuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgY29uc3QgcHJvcGVydGllcyA9IHtcbiAgICAgICAgc2l6ZToge3ZhbHVlOiBzaXplfSxcbiAgICAgICAgWyR0eXBlXToge3ZhbHVlOiB0eXBlfSxcbiAgICAgICAgWyRsYWJlbF06IHt2YWx1ZTogbGFiZWx9XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmRleCA9IDBcbiAgICAgIHdoaWxlIChpbmRleCA8IHNpemUpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF1cbiAgICAgICAgY29uc3QgZmllbGRUeXBlID0gdHlwZU9mKGRlc2NyaXB0b3Jba2V5XSlcblxuICAgICAgICBpZiAoZmllbGRUeXBlKSB7XG4gICAgICAgICAgdHlwZVtrZXldID0gZmllbGRUeXBlXG4gICAgICAgICAgcHJvcGVydGllc1trZXldID0ge2dldDpHZXR0ZXIoa2V5KSwgc2V0OlNldHRlcihrZXkpLCBlbnVtZXJhYmxlOiB0cnVlfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IFR5cGVFcnJvcihgSW52YWxpZCBmaWVsZCBkZXNjcmlwdG9yIHByb3ZpZGVkIGZvciBhIFwiJHtrZXl9XCIgZmllbGRgKVxuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXggPSBpbmRleCArIDFcbiAgICAgIH1cblxuICAgICAgY29uc3QgUmVjb3JkVHlwZSA9IGZ1bmN0aW9uKHN0cnVjdHVyZSkge1xuICAgICAgICBjb25zdCBpc05ldyA9IHRoaXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlXG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gaXNOZXcgPyB0aGlzLmNvbnN0cnVjdG9yIDogUmVjb3JkVHlwZVxuXG4gICAgICAgIGlmIChzdHJ1Y3R1cmUgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIHJldHVybiBzdHJ1Y3R1cmVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdHlwZVskcmVhZF0oc3RydWN0dXJlKVxuXG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyByZXN1bHRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05ldykge1xuICAgICAgICAgIHRoaXNbJHN0b3JlXSA9IHJlc3VsdFskc3RvcmVdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb3BlcnRpZXMuY29uc3RydWN0b3IgPSB7dmFsdWU6IFJlY29yZFR5cGV9XG4gICAgICBSZWNvcmRUeXBlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUmVjb3JkUHJvdG90eXBlLCBwcm9wZXJ0aWVzKVxuICAgICAgY29uc3QgcHJvdG90eXBlID0gUmVjb3JkVHlwZS5wcm90b3R5cGVcblxuICAgICAgcmV0dXJuIFJlY29yZFR5cGVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGBUeXBlZC5SZWNvcmQgZGVzY3JpcHRvciBtdXN0IGRlZmluZSBhdCBsZWFzdCBvbiBmaWVsZGApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IFR5cGVFcnJvcihgVHlwZWQuUmVjb3JkIG11c3QgYmUgcGFzc2VkIGEgZGVzY3JpcHRvciBvZiBmaWVsZHNgKVxuICB9XG59XG5SZWNvcmQuVHlwZSA9IFR5cGVkUmVjb3JkXG5SZWNvcmQucHJvdG90eXBlID0gVHlwZWRSZWNvcmQucHJvdG90eXBlXG5jb25zdCBSZWNvcmRQcm90b3R5cGUgPSBUeXBlZFJlY29yZC5wcm90b3R5cGVcblxuXG5SZWNvcmRQcm90b3R5cGVbVHlwZWQuREVMRVRFXSA9IFJlY29yZFByb3RvdHlwZS5yZW1vdmVcblxuLy8gTGFyZ2UgcGFydCBvZiB0aGUgUmVjb3JkIEFQSSBpcyBpbXBsZW1lbnRlZCBieSBJbW11dGFiZWwuTWFwXG4vLyBhbmQgaXMganVzdCBjb3BpZWQgb3Zlci5cblJlY29yZFByb3RvdHlwZS5kZWxldGVJbiA9IE1hcC5wcm90b3R5cGUuZGVsZXRlSW5cblJlY29yZFByb3RvdHlwZS5yZW1vdmVJbiA9IE1hcC5wcm90b3R5cGUucmVtb3ZlSW5cblJlY29yZFByb3RvdHlwZS5tZXJnZSA9IE1hcC5wcm90b3R5cGUubWVyZ2VcblJlY29yZFByb3RvdHlwZS5tZXJnZVdpdGggPSBNYXAucHJvdG90eXBlLm1lcmdlV2l0aFxuUmVjb3JkUHJvdG90eXBlLm1lcmdlSW4gPSBNYXAucHJvdG90eXBlLm1lcmdlSW5cblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXAgPSBNYXAucHJvdG90eXBlLm1lcmdlRGVlcFxuUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBNYXAucHJvdG90eXBlLm1lcmdlRGVlcFdpdGhcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IE1hcC5wcm90b3R5cGUubWVyZ2VEZWVwSW5cblJlY29yZFByb3RvdHlwZS5zZXRJbiA9IE1hcC5wcm90b3R5cGUuc2V0SW5cblJlY29yZFByb3RvdHlwZS51cGRhdGUgPSBNYXAucHJvdG90eXBlLnVwZGF0ZVxuUmVjb3JkUHJvdG90eXBlLnVwZGF0ZUluID0gTWFwLnByb3RvdHlwZS51cGRhdGVJblxuUmVjb3JkUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXAucHJvdG90eXBlLndpdGhNdXRhdGlvbnNcblJlY29yZFByb3RvdHlwZS5hc011dGFibGUgPSBNYXAucHJvdG90eXBlLmFzTXV0YWJsZVxuUmVjb3JkUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwLnByb3RvdHlwZS5hc0ltbXV0YWJsZVxuXG4vLyBMYXJnZSBjaHVjayBvZiBBUEkgaW5oZXJpdGVkIGZyb20gSXRlcmFibGUgZG9lcyBub3QgbWFrZXNcbi8vIG11Y2ggc2Vuc2UgaW4gdGhlIGNvbnRleHQgb2YgcmVjb3JkcyBzbyB3ZSB1bmRlZmluZSBpdC5cblJlY29yZFByb3RvdHlwZS5tYXAgPSB2b2lkKDApXG5SZWNvcmRQcm90b3R5cGUuZmlsdGVyID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLmZpbHRlck5vdCA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5mbGlwID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLm1hcEtleXMgPSB2b2lkKDApXG5SZWNvcmRQcm90b3R5cGUubWFwRW50cmllcyA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5zb3J0ID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnNvcnRCeSA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5yZXZlcnNlID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnNsaWNlID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLmJ1dExhc3QgPSB2b2lkKDApXG5SZWNvcmRQcm90b3R5cGUuZmxhdE1hcCA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5mbGF0dGVuID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnJlc3QgPSB2b2lkKDApXG5SZWNvcmRQcm90b3R5cGUuc2tpcCA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5za2lwTGFzdCA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS5za2lwV2hpbGUgPSB2b2lkKDApXG5SZWNvcmRQcm90b3R5cGUuc2tpcFVudGlsID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnNvcnRCeSA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS50YWtlID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnRha2VMYXN0ID0gdm9pZCgwKVxuUmVjb3JkUHJvdG90eXBlLnRha2VXaGlsZSA9IHZvaWQoMClcblJlY29yZFByb3RvdHlwZS50YWtlVW50aWwgPSB2b2lkKDApXG4iXX0=
