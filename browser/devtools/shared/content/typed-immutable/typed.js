(function (global, factory) {
  factory(exports, require('devtools/shared/content/immutable'));
})(this, function (exports, _immutable) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  if (typeof Symbol === 'undefined') {
    var Symbol = function Symbol(hint) {
      return '@@' + hint;
    };
    Symbol['for'] = Symbol;
  }

  function Construct() {}
  var construct = function construct(value) {
    Construct.prototype = value.constructor.prototype;
    return new Construct();
  };

  exports.construct = construct;
  var $type = Symbol['for']("typed/type");
  var $store = Symbol['for']("typed/store");
  var $empty = Symbol['for']("typed/empty");

  var $maybe = Symbol['for']("typed/type/maybe");
  var $default = Symbol['for']("typed/type/default");
  var $label = Symbol['for']("typed/type/label");

  var $init = Symbol['for']("transducer/init");
  var $result = Symbol['for']("transducer/result");
  var $step = Symbol['for']("transducer/step");
  var $read = Symbol['for']("typed/type/read");
  var $parse = Symbol['for']("typed/type/parse");
  var $typeName = Symbol("typed/type/name");
  var $typeSignature = Symbol("typed/type/signature");

  var Typed = function Typed(label, parse, defaultValue) {
    var ValueType = (function (_Type) {
      _inherits(ValueType, _Type);

      function ValueType(defaultValue) {
        _classCallCheck(this, ValueType);

        _get(Object.getPrototypeOf(ValueType.prototype), 'constructor', this).call(this);
        this[$default] = defaultValue;
      }

      return ValueType;
    })(Type);

    var prototype = ValueType.prototype;
    prototype[$default] = defaultValue;
    prototype[$parse] = parse;
    prototype[$label] = label;

    var TypedValue = function TypedValue(defaultValue) {
      return defaultValue === void 0 ? prototype : new ValueType(defaultValue);
    };
    TypedValue.prototype = prototype;

    return TypedValue;
  };

  exports.Typed = Typed;
  Typed.label = $label;
  Typed.defaultValue = $default;
  Typed.read = $read;
  Typed.typeName = $typeName;
  Typed.typeSignature = $typeSignature;

  Typed.type = $type;
  Typed.store = $store;
  Typed.init = $init;
  Typed.result = $result;
  Typed.step = $step;
  Typed.DELETE = "delete";
  Typed.empty = $empty;

  var typeName = function typeName(type) {
    return type[$typeName]();
  };
  var typeSignature = function typeSignature(type) {
    return type[$typeSignature]();
  };

  var Type = (function () {
    function Type() {
      _classCallCheck(this, Type);
    }

    _createClass(Type, [{
      key: Typed.read,
      value: function value() {
        var _value = arguments.length <= 0 || arguments[0] === undefined ? this[$default] : arguments[0];

        return this[$parse](_value);
      }
    }, {
      key: Typed.parse,
      value: function value(_value2) {
        throw TypeError('Type implementation must implement "[read.symbol]" method');
      }
    }, {
      key: Typed.typeName,
      value: function value() {
        var label = this[$label];
        var defaultValue = this[$default];
        return defaultValue === void 0 ? label : label + '(' + JSON.stringify(defaultValue) + ')';
      }
    }]);

    return Type;
  })();

  exports.Type = Type;

  var ObjectPrototype = Object.prototype;

  // Returns `true` if given `x` is a JS array.
  var isArray = Array.isArray || function (x) {
    return ObjectPrototype.toString.call(x) === '[object Array]';
  };

  // Returns `true` if given `x` is a regular expression.
  var isRegExp = function isRegExp(x) {
    return ObjectPrototype.toString.call(x) === '[object RegExp]';
  };

  var typeOf = function typeOf(x) {
    var type = arguments.length <= 1 || arguments[1] === undefined ? typeof x : arguments[1];
    return (function () {
      return x === void 0 ? x : x === null ? x : x[$read] ? x : x.prototype && x.prototype[$read] ? x.prototype : type === "number" ? new Typed.Number(x) : type === "string" ? new Typed.String(x) : type === "boolean" ? new Typed.Boolean(x) : type === "symbol" ? new Typed.Symbol(x) : isArray(x) ? Typed.Array(x) : isRegExp(x) ? new Typed.RegExp(x) : x === String ? Typed.String.prototype : x === Number ? Typed.Number.prototype : x === Boolean ? Typed.Boolean.prototype : x === RegExp ? Typed.RegExp.prototype : x === Array ? Typed.Array.prototype : x === Symbol ? Typed.Symbol.prototype : x === Date ? Typed.Date.prototype : Any;
    })();
  };

  exports.typeOf = typeOf;
  var Any = Typed("Any", function (value) {
    return value;
  })();
  exports.Any = Any;
  Typed.Any = Any;

  Typed.Number = Typed("Number", function (value) {
    return typeof value === "number" ? value : TypeError('"' + value + '" is not a number');
  });

  Typed.String = Typed("String", function (value) {
    return typeof value === "string" ? value : TypeError('"' + value + '" is not a string');
  });

  Typed.Symbol = Typed("Symbol", function (value) {
    return typeof value === "symbol" ? value : TypeError('"' + value + '" is not a symbol');
  });

  Typed.Array = Typed("Array", function (value) {
    return isArray(value) ? value : TypeError('"' + value + '" is not an array');
  });

  Typed.RegExp = Typed("RegExp", function (value) {
    return value instanceof RegExp ? value : TypeError('"' + value + '" is not a regexp');
  });

  Typed.Boolean = Typed("Boolean", function (value) {
    return value === true ? true : value === false ? false : TypeError('"' + value + '" is not a boolean');
  });

  var MaybeType = (function (_Type2) {
    _inherits(MaybeType, _Type2);

    function MaybeType(type) {
      _classCallCheck(this, MaybeType);

      _get(Object.getPrototypeOf(MaybeType.prototype), 'constructor', this).call(this);
      this[$type] = type;
    }

    _createClass(MaybeType, [{
      key: Typed.typeName,
      value: function value() {
        return 'Maybe(' + this[$type][$typeName]() + ')';
      }
    }, {
      key: Typed.read,
      value: function value(_value3) {
        var result = _value3 == null ? null : this[$type][$read](_value3);

        return !(result instanceof TypeError) ? result : TypeError('"' + _value3 + '" is not nully nor it is of ' + this[$type][$typeName]() + ' type');
      }
    }]);

    return MaybeType;
  })(Type);

  var Maybe = function Maybe(Type) {
    var type = typeOf(Type);
    if (type === Any) {
      throw TypeError(Type + ' is not a valid type');
    }

    return type[$maybe] || (type[$maybe] = new MaybeType(type));
  };
  exports.Maybe = Maybe;
  Maybe.Type = MaybeType;

  var UnionType = (function (_Type3) {
    _inherits(UnionType, _Type3);

    function UnionType(variants) {
      _classCallCheck(this, UnionType);

      _get(Object.getPrototypeOf(UnionType.prototype), 'constructor', this).call(this);
      this[$type] = variants;
    }

    // Returns `xs` excluding any values that are included in `ys`.

    _createClass(UnionType, [{
      key: Typed.typeName,
      value: function value() {
        return 'Union(' + this[$type].map(typeName).join(', ') + ')';
      }
    }, {
      key: Typed.read,
      value: function value(_value4) {
        var variants = this[$type];
        var count = variants.length;
        var index = 0;
        while (index < count) {
          var variant = variants[index];
          if (_value4 instanceof variant.constructor) {
            return _value4;
          }
          index = index + 1;
        }

        index = 0;
        while (index < count) {
          var result = variants[index][$read](_value4);
          if (!(result instanceof TypeError)) {
            return result;
          }
          index = index + 1;
        }

        return TypeError('"' + _value4 + '" does not satisfy ' + this[$typeName]() + ' type');
      }
    }]);

    return UnionType;
  })(Type);

  var subtract = function subtract(xs, ys) {
    return xs.filter(function (x) {
      return ys.indexOf(x) < 0;
    });
  };

  // Returns array including all values from `xs` and all values from
  // `ys` that aren't already included in `xs`. It will also attempt
  // to return either `xs` or `ys` if one of them is a superset of other.
  // return `xs` or `ys` if
  var union = function union(xs, ys) {
    // xs can be superset only if it contains more items then
    // ys. If that's a case find items in ys that arent included
    // in xs. If such items do not exist return back `xs` otherwise
    // return concatination of xs with those items.
    // those items
    if (xs.length > ys.length) {
      var diff = subtract(ys, xs);
      return diff.length === 0 ? xs : xs.concat(diff);
    }
    // if number of items in xs is not greater than number of items in ys
    // then either xs is either subset or equal of `ys`. There for we find
    // ys that are not included in `xs` if such items aren't found ys is
    // either superset or equal so just return ys otherwise return concatination
    // of those items with `ys`.
    else {
        var diff = subtract(xs, ys);
        return diff.length === 0 ? ys : diff.concat(ys);
      }
  };

  var Union = function Union() {
    for (var _len = arguments.length, Types = Array(_len), _key = 0; _key < _len; _key++) {
      Types[_key] = arguments[_key];
    }

    var count = Types.length;

    if (count === 0) {
      throw TypeError('Union must be of at at least one type');
    }

    var variants = null;
    var type = null;
    var index = 0;
    while (index < count) {
      var variant = typeOf(Types[index]);
      // If there is `Any` present than union is also `Any`.
      if (variant === Any) {
        return Any;
      }
      // If this is the first type we met than we assume it's the
      // one that satisfies all types.
      if (!variants) {
        type = variant;
        variants = type instanceof UnionType ? type[$type] : [variant];
      } else if (variants.indexOf(variant) < 0) {
        // If current reader is of union type
        if (variant instanceof UnionType) {
          var variantUnion = union(variants, variant[$type]);

          // If `reader.readers` matches union of readers, then
          // current reader is a superset so we use it as a type
          // that satisfies all types.
          if (variantUnion === variant[$type]) {
            type = variant;
            variants = variantUnion;
          }
          // If current readers is not the union than it does not
          // satisfy currenty reader. There for we update readers
          // and unset a type.
          else if (variantUnion !== variants) {
              type = null;
              variants = variantUnion;
            }
        } else {
          type = null;
          variants.push(variant);
        }
      }

      index = index + 1;
    }

    return type ? type : new UnionType(variants);
  };
  exports.Union = Union;
  Union.Type = UnionType;

  Typed.Number.Range = function (from, to, defaultValue) {
    if (to === undefined) to = +Infinity;
    return Typed('Typed.Number.Range(' + from + '..' + to + ')', function (value) {
      if (typeof value !== 'number') {
        return TypeError('"' + value + '" is not a number');
      }

      if (!(value >= from && value <= to)) {
        return TypeError('"' + value + '" isn\'t in the range of ' + from + '..' + to);
      }

      return value;
    }, defaultValue);
  };
});
//# sourceMappingURL=data:application/json;base64,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R0FBQSxDQUFBIiwiZmlsZSI6InR5cGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSdcblxuaWYgKHR5cGVvZihTeW1ib2wpID09PSAndW5kZWZpbmVkJykge1xuICB2YXIgU3ltYm9sID0gaGludCA9PiBgQEAke2hpbnR9YFxuICBTeW1ib2wuZm9yID0gU3ltYm9sXG59XG5cbmZ1bmN0aW9uIENvbnN0cnVjdCgpIHt9XG5leHBvcnQgY29uc3QgY29uc3RydWN0ID0gdmFsdWUgPT4ge1xuICBDb25zdHJ1Y3QucHJvdG90eXBlID0gdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlXG4gIHJldHVybiBuZXcgQ29uc3RydWN0KClcbn1cblxuY29uc3QgJHR5cGUgPSBTeW1ib2wuZm9yKFwidHlwZWQvdHlwZVwiKVxuY29uc3QgJHN0b3JlID0gU3ltYm9sLmZvcihcInR5cGVkL3N0b3JlXCIpXG5jb25zdCAkZW1wdHkgPSBTeW1ib2wuZm9yKFwidHlwZWQvZW1wdHlcIilcblxuY29uc3QgJG1heWJlID0gU3ltYm9sLmZvcihcInR5cGVkL3R5cGUvbWF5YmVcIilcbmNvbnN0ICRkZWZhdWx0ID0gU3ltYm9sLmZvcihcInR5cGVkL3R5cGUvZGVmYXVsdFwiKVxuY29uc3QgJGxhYmVsID0gU3ltYm9sLmZvcihcInR5cGVkL3R5cGUvbGFiZWxcIilcblxuY29uc3QgJGluaXQgPSBTeW1ib2wuZm9yKFwidHJhbnNkdWNlci9pbml0XCIpXG5jb25zdCAkcmVzdWx0ID0gU3ltYm9sLmZvcihcInRyYW5zZHVjZXIvcmVzdWx0XCIpXG5jb25zdCAkc3RlcCA9IFN5bWJvbC5mb3IoXCJ0cmFuc2R1Y2VyL3N0ZXBcIilcbmNvbnN0ICRyZWFkID0gU3ltYm9sLmZvcihcInR5cGVkL3R5cGUvcmVhZFwiKVxuY29uc3QgJHBhcnNlID0gU3ltYm9sLmZvcihcInR5cGVkL3R5cGUvcGFyc2VcIilcbmNvbnN0ICR0eXBlTmFtZSA9IFN5bWJvbChcInR5cGVkL3R5cGUvbmFtZVwiKVxuY29uc3QgJHR5cGVTaWduYXR1cmUgPSBTeW1ib2woXCJ0eXBlZC90eXBlL3NpZ25hdHVyZVwiKVxuXG5leHBvcnQgY29uc3QgVHlwZWQgPSBmdW5jdGlvbihsYWJlbCwgcGFyc2UsIGRlZmF1bHRWYWx1ZSkge1xuICBjbGFzcyBWYWx1ZVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcihkZWZhdWx0VmFsdWUpIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIHRoaXNbJGRlZmF1bHRdID0gZGVmYXVsdFZhbHVlXG4gICAgfVxuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gVmFsdWVUeXBlLnByb3RvdHlwZVxuICBwcm90b3R5cGVbJGRlZmF1bHRdID0gZGVmYXVsdFZhbHVlXG4gIHByb3RvdHlwZVskcGFyc2VdID0gcGFyc2VcbiAgcHJvdG90eXBlWyRsYWJlbF0gPSBsYWJlbFxuXG4gIGNvbnN0IFR5cGVkVmFsdWUgPSBmdW5jdGlvbihkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlID09PSB2b2lkKDApID8gcHJvdG90eXBlIDpcbiAgICBuZXcgVmFsdWVUeXBlKGRlZmF1bHRWYWx1ZSlcbiAgfVxuICBUeXBlZFZhbHVlLnByb3RvdHlwZSA9IHByb3RvdHlwZVxuXG4gIHJldHVybiBUeXBlZFZhbHVlXG59XG5cblR5cGVkLmxhYmVsID0gJGxhYmVsXG5UeXBlZC5kZWZhdWx0VmFsdWUgPSAkZGVmYXVsdFxuVHlwZWQucmVhZCA9ICRyZWFkXG5UeXBlZC50eXBlTmFtZSA9ICR0eXBlTmFtZVxuVHlwZWQudHlwZVNpZ25hdHVyZSA9ICR0eXBlU2lnbmF0dXJlXG5cblR5cGVkLnR5cGUgPSAkdHlwZVxuVHlwZWQuc3RvcmUgPSAkc3RvcmVcblR5cGVkLmluaXQgPSAkaW5pdFxuVHlwZWQucmVzdWx0ID0gJHJlc3VsdFxuVHlwZWQuc3RlcCA9ICRzdGVwXG5UeXBlZC5ERUxFVEUgPSBcImRlbGV0ZVwiXG5UeXBlZC5lbXB0eSA9ICRlbXB0eVxuXG5jb25zdCB0eXBlTmFtZSA9IHR5cGUgPT4gdHlwZVskdHlwZU5hbWVdKClcbmNvbnN0IHR5cGVTaWduYXR1cmUgPSB0eXBlID0+IHR5cGVbJHR5cGVTaWduYXR1cmVdKClcblxuZXhwb3J0IGNsYXNzIFR5cGUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIFtUeXBlZC5yZWFkXSh2YWx1ZT10aGlzWyRkZWZhdWx0XSkge1xuICAgIHJldHVybiB0aGlzWyRwYXJzZV0odmFsdWUpXG4gIH1cbiAgW1R5cGVkLnBhcnNlXSh2YWx1ZSkge1xuICAgIHRocm93IFR5cGVFcnJvcihgVHlwZSBpbXBsZW1lbnRhdGlvbiBtdXN0IGltcGxlbWVudCBcIltyZWFkLnN5bWJvbF1cIiBtZXRob2RgKVxuICB9XG4gIFtUeXBlZC50eXBlTmFtZV0oKSB7XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzWyRsYWJlbF1cbiAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSB0aGlzWyRkZWZhdWx0XVxuICAgIHJldHVybiBkZWZhdWx0VmFsdWUgPT09IHZvaWQoMCkgPyBsYWJlbCA6IGAke2xhYmVsfSgke0pTT04uc3RyaW5naWZ5KGRlZmF1bHRWYWx1ZSl9KWBcbiAgfVxufVxuXG5jb25zdCBPYmplY3RQcm90b3R5cGUgPSBPYmplY3QucHJvdG90eXBlXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIGB4YCBpcyBhIEpTIGFycmF5LlxuY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHxcbiAgKHggPT4gT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XScpXG5cbi8vIFJldHVybnMgYHRydWVgIGlmIGdpdmVuIGB4YCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbmNvbnN0IGlzUmVnRXhwID0geCA9PlxuICBPYmplY3RQcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblxuXG5leHBvcnQgY29uc3QgdHlwZU9mID0gKHgsIHR5cGU9dHlwZW9mKHgpKSA9PlxuICB4ID09PSB2b2lkKDApID8geCA6XG4gIHggPT09IG51bGwgPyB4IDpcbiAgeFskcmVhZF0gPyB4IDpcbiAgKHgucHJvdG90eXBlICYmIHgucHJvdG90eXBlWyRyZWFkXSkgPyB4LnByb3RvdHlwZSA6XG4gIHR5cGUgPT09IFwibnVtYmVyXCIgPyBuZXcgVHlwZWQuTnVtYmVyKHgpIDpcbiAgdHlwZSA9PT0gXCJzdHJpbmdcIiA/IG5ldyBUeXBlZC5TdHJpbmcoeCkgOlxuICB0eXBlID09PSBcImJvb2xlYW5cIiA/IG5ldyBUeXBlZC5Cb29sZWFuKHgpIDpcbiAgdHlwZSA9PT0gXCJzeW1ib2xcIiA/IG5ldyBUeXBlZC5TeW1ib2woeCkgOlxuICBpc0FycmF5KHgpID8gVHlwZWQuQXJyYXkoeCkgOlxuICBpc1JlZ0V4cCh4KSA/IG5ldyBUeXBlZC5SZWdFeHAoeCkgOlxuICB4ID09PSBTdHJpbmcgPyBUeXBlZC5TdHJpbmcucHJvdG90eXBlIDpcbiAgeCA9PT0gTnVtYmVyID8gVHlwZWQuTnVtYmVyLnByb3RvdHlwZSA6XG4gIHggPT09IEJvb2xlYW4gPyBUeXBlZC5Cb29sZWFuLnByb3RvdHlwZSA6XG4gIHggPT09IFJlZ0V4cCA/IFR5cGVkLlJlZ0V4cC5wcm90b3R5cGUgOlxuICB4ID09PSBBcnJheSA/IFR5cGVkLkFycmF5LnByb3RvdHlwZSA6XG4gIHggPT09IFN5bWJvbCA/IFR5cGVkLlN5bWJvbC5wcm90b3R5cGUgOlxuICB4ID09PSBEYXRlID8gVHlwZWQuRGF0ZS5wcm90b3R5cGUgOlxuICBBbnk7XG5cbmV4cG9ydCBjb25zdCBBbnkgPSBUeXBlZChcIkFueVwiLCB2YWx1ZSA9PiB2YWx1ZSkoKVxuVHlwZWQuQW55ID0gQW55XG5cblR5cGVkLk51bWJlciA9IFR5cGVkKFwiTnVtYmVyXCIsIHZhbHVlID0+XG4gIHR5cGVvZih2YWx1ZSkgPT09IFwibnVtYmVyXCIgPyB2YWx1ZSA6XG4gIFR5cGVFcnJvcihgXCIke3ZhbHVlfVwiIGlzIG5vdCBhIG51bWJlcmApKVxuXG5UeXBlZC5TdHJpbmcgPSBUeXBlZChcIlN0cmluZ1wiLCB2YWx1ZSA9PlxuICB0eXBlb2YodmFsdWUpID09PSBcInN0cmluZ1wiID8gdmFsdWUgOlxuICBUeXBlRXJyb3IoYFwiJHt2YWx1ZX1cIiBpcyBub3QgYSBzdHJpbmdgKSlcblxuVHlwZWQuU3ltYm9sID0gVHlwZWQoXCJTeW1ib2xcIiwgdmFsdWUgPT5cbiAgdHlwZW9mKHZhbHVlKSA9PT0gXCJzeW1ib2xcIiA/IHZhbHVlIDpcbiAgVHlwZUVycm9yKGBcIiR7dmFsdWV9XCIgaXMgbm90IGEgc3ltYm9sYCkpXG5cblR5cGVkLkFycmF5ID0gVHlwZWQoXCJBcnJheVwiLCB2YWx1ZSA9PlxuICBpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDpcbiAgVHlwZUVycm9yKGBcIiR7dmFsdWV9XCIgaXMgbm90IGFuIGFycmF5YCkpXG5cblR5cGVkLlJlZ0V4cCA9IFR5cGVkKFwiUmVnRXhwXCIsIHZhbHVlID0+XG4gIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwID8gdmFsdWUgOlxuICBUeXBlRXJyb3IoYFwiJHt2YWx1ZX1cIiBpcyBub3QgYSByZWdleHBgKSlcblxuVHlwZWQuQm9vbGVhbiA9IFR5cGVkKFwiQm9vbGVhblwiLCB2YWx1ZSA9PlxuICB2YWx1ZSA9PT0gdHJ1ZSA/IHRydWUgOlxuICB2YWx1ZSA9PT0gZmFsc2UgPyBmYWxzZSA6XG4gIFR5cGVFcnJvcihgXCIke3ZhbHVlfVwiIGlzIG5vdCBhIGJvb2xlYW5gKSlcblxuY2xhc3MgTWF5YmVUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpc1skdHlwZV0gPSB0eXBlXG4gIH1cbiAgW1R5cGVkLnR5cGVOYW1lXSgpIHtcbiAgICByZXR1cm4gYE1heWJlKCR7dGhpc1skdHlwZV1bJHR5cGVOYW1lXSgpfSlgXG4gIH1cbiAgW1R5cGVkLnJlYWRdKHZhbHVlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB0aGlzWyR0eXBlXVskcmVhZF0odmFsdWUpXG5cbiAgICByZXR1cm4gIShyZXN1bHQgaW5zdGFuY2VvZiBUeXBlRXJyb3IpID8gcmVzdWx0IDpcbiAgICAgICAgICAgVHlwZUVycm9yKGBcIiR7dmFsdWV9XCIgaXMgbm90IG51bGx5IG5vciBpdCBpcyBvZiAke3RoaXNbJHR5cGVdWyR0eXBlTmFtZV0oKX0gdHlwZWApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1heWJlID0gVHlwZSA9PiB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlT2YoVHlwZSlcbiAgaWYgKHR5cGUgPT09IEFueSkge1xuICAgIHRocm93IFR5cGVFcnJvcihgJHtUeXBlfSBpcyBub3QgYSB2YWxpZCB0eXBlYClcbiAgfVxuXG4gIHJldHVybiB0eXBlWyRtYXliZV0gfHwgKHR5cGVbJG1heWJlXSA9IG5ldyBNYXliZVR5cGUodHlwZSkpXG59XG5NYXliZS5UeXBlID0gTWF5YmVUeXBlXG5cblxuY2xhc3MgVW5pb25UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHZhcmlhbnRzKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXNbJHR5cGVdID0gdmFyaWFudHNcbiAgfVxuICBbVHlwZWQudHlwZU5hbWVdKCkge1xuICAgIHJldHVybiBgVW5pb24oJHt0aGlzWyR0eXBlXS5tYXAodHlwZU5hbWUpLmpvaW4oJywgJyl9KWBcbiAgfVxuICBbVHlwZWQucmVhZF0odmFsdWUpIHtcbiAgICBjb25zdCB2YXJpYW50cyA9IHRoaXNbJHR5cGVdXG4gICAgY29uc3QgY291bnQgPSB2YXJpYW50cy5sZW5ndGhcbiAgICBsZXQgaW5kZXggPSAwXG4gICAgd2hpbGUgKGluZGV4IDwgY291bnQpIHtcbiAgICAgIGNvbnN0IHZhcmlhbnQgPSB2YXJpYW50c1tpbmRleF1cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHZhcmlhbnQuY29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICBpbmRleCA9IGluZGV4ICsgMVxuICAgIH1cblxuICAgIGluZGV4ID0gMFxuICAgIHdoaWxlIChpbmRleCA8IGNvdW50KSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB2YXJpYW50c1tpbmRleF1bJHJlYWRdKHZhbHVlKVxuICAgICAgaWYgKCEocmVzdWx0IGluc3RhbmNlb2YgVHlwZUVycm9yKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICBpbmRleCA9IGluZGV4ICsgMVxuICAgIH1cblxuICAgIHJldHVybiBUeXBlRXJyb3IoYFwiJHt2YWx1ZX1cIiBkb2VzIG5vdCBzYXRpc2Z5ICR7dGhpc1skdHlwZU5hbWVdKCl9IHR5cGVgKVxuICB9XG59XG5cbi8vIFJldHVybnMgYHhzYCBleGNsdWRpbmcgYW55IHZhbHVlcyB0aGF0IGFyZSBpbmNsdWRlZCBpbiBgeXNgLlxuY29uc3Qgc3VidHJhY3QgPSAoeHMsIHlzKSA9PlxuICB4cy5maWx0ZXIoeCA9PiB5cy5pbmRleE9mKHgpIDwgMClcblxuLy8gUmV0dXJucyBhcnJheSBpbmNsdWRpbmcgYWxsIHZhbHVlcyBmcm9tIGB4c2AgYW5kIGFsbCB2YWx1ZXMgZnJvbVxuLy8gYHlzYCB0aGF0IGFyZW4ndCBhbHJlYWR5IGluY2x1ZGVkIGluIGB4c2AuIEl0IHdpbGwgYWxzbyBhdHRlbXB0XG4vLyB0byByZXR1cm4gZWl0aGVyIGB4c2Agb3IgYHlzYCBpZiBvbmUgb2YgdGhlbSBpcyBhIHN1cGVyc2V0IG9mIG90aGVyLlxuLy8gcmV0dXJuIGB4c2Agb3IgYHlzYCBpZlxuY29uc3QgdW5pb24gPSAoeHMsIHlzKSA9PiB7XG4gIC8vIHhzIGNhbiBiZSBzdXBlcnNldCBvbmx5IGlmIGl0IGNvbnRhaW5zIG1vcmUgaXRlbXMgdGhlblxuICAvLyB5cy4gSWYgdGhhdCdzIGEgY2FzZSBmaW5kIGl0ZW1zIGluIHlzIHRoYXQgYXJlbnQgaW5jbHVkZWRcbiAgLy8gaW4geHMuIElmIHN1Y2ggaXRlbXMgZG8gbm90IGV4aXN0IHJldHVybiBiYWNrIGB4c2Agb3RoZXJ3aXNlXG4gIC8vIHJldHVybiBjb25jYXRpbmF0aW9uIG9mIHhzIHdpdGggdGhvc2UgaXRlbXMuXG4gIC8vIHRob3NlIGl0ZW1zXG4gIGlmICh4cy5sZW5ndGggPiB5cy5sZW5ndGgpIHtcbiAgICBjb25zdCBkaWZmID0gc3VidHJhY3QoeXMsIHhzKVxuICAgIHJldHVybiBkaWZmLmxlbmd0aCA9PT0gMCA/IHhzIDogeHMuY29uY2F0KGRpZmYpXG4gIH1cbiAgLy8gaWYgbnVtYmVyIG9mIGl0ZW1zIGluIHhzIGlzIG5vdCBncmVhdGVyIHRoYW4gbnVtYmVyIG9mIGl0ZW1zIGluIHlzXG4gIC8vIHRoZW4gZWl0aGVyIHhzIGlzIGVpdGhlciBzdWJzZXQgb3IgZXF1YWwgb2YgYHlzYC4gVGhlcmUgZm9yIHdlIGZpbmRcbiAgLy8geXMgdGhhdCBhcmUgbm90IGluY2x1ZGVkIGluIGB4c2AgaWYgc3VjaCBpdGVtcyBhcmVuJ3QgZm91bmQgeXMgaXNcbiAgLy8gZWl0aGVyIHN1cGVyc2V0IG9yIGVxdWFsIHNvIGp1c3QgcmV0dXJuIHlzIG90aGVyd2lzZSByZXR1cm4gY29uY2F0aW5hdGlvblxuICAvLyBvZiB0aG9zZSBpdGVtcyB3aXRoIGB5c2AuXG4gIGVsc2Uge1xuICAgIGNvbnN0IGRpZmYgPSBzdWJ0cmFjdCh4cywgeXMpXG4gICAgcmV0dXJuIGRpZmYubGVuZ3RoID09PSAwID8geXMgOiBkaWZmLmNvbmNhdCh5cylcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVW5pb24gPSAoLi4uVHlwZXMpID0+IHtcbiAgY29uc3QgY291bnQgPSBUeXBlcy5sZW5ndGhcblxuICBpZiAoY291bnQgPT09IDApIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoYFVuaW9uIG11c3QgYmUgb2YgYXQgYXQgbGVhc3Qgb25lIHR5cGVgKVxuICB9XG5cbiAgbGV0IHZhcmlhbnRzID0gbnVsbFxuICBsZXQgdHlwZSA9IG51bGxcbiAgbGV0IGluZGV4ID0gMDtcbiAgd2hpbGUgKGluZGV4IDwgY291bnQpIHtcbiAgICBjb25zdCB2YXJpYW50ID0gdHlwZU9mKFR5cGVzW2luZGV4XSlcbiAgICAvLyBJZiB0aGVyZSBpcyBgQW55YCBwcmVzZW50IHRoYW4gdW5pb24gaXMgYWxzbyBgQW55YC5cbiAgICBpZiAodmFyaWFudCA9PT0gQW55KSB7XG4gICAgICByZXR1cm4gQW55XG4gICAgfVxuICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHR5cGUgd2UgbWV0IHRoYW4gd2UgYXNzdW1lIGl0J3MgdGhlXG4gICAgLy8gb25lIHRoYXQgc2F0aXNmaWVzIGFsbCB0eXBlcy5cbiAgICBpZiAoIXZhcmlhbnRzKSB7XG4gICAgICB0eXBlID0gdmFyaWFudFxuICAgICAgdmFyaWFudHMgPSB0eXBlIGluc3RhbmNlb2YgVW5pb25UeXBlID8gdHlwZVskdHlwZV0gOiBbdmFyaWFudF1cbiAgICB9IGVsc2UgaWYgKHZhcmlhbnRzLmluZGV4T2YodmFyaWFudCkgPCAwKSB7XG4gICAgICAvLyBJZiBjdXJyZW50IHJlYWRlciBpcyBvZiB1bmlvbiB0eXBlXG4gICAgICBpZiAodmFyaWFudCBpbnN0YW5jZW9mIFVuaW9uVHlwZSkge1xuICAgICAgICBjb25zdCB2YXJpYW50VW5pb24gPSB1bmlvbih2YXJpYW50cywgdmFyaWFudFskdHlwZV0pXG5cbiAgICAgICAgLy8gSWYgYHJlYWRlci5yZWFkZXJzYCBtYXRjaGVzIHVuaW9uIG9mIHJlYWRlcnMsIHRoZW5cbiAgICAgICAgLy8gY3VycmVudCByZWFkZXIgaXMgYSBzdXBlcnNldCBzbyB3ZSB1c2UgaXQgYXMgYSB0eXBlXG4gICAgICAgIC8vIHRoYXQgc2F0aXNmaWVzIGFsbCB0eXBlcy5cbiAgICAgICAgaWYgKHZhcmlhbnRVbmlvbiA9PT0gdmFyaWFudFskdHlwZV0pIHtcbiAgICAgICAgICB0eXBlID0gdmFyaWFudFxuICAgICAgICAgIHZhcmlhbnRzID0gdmFyaWFudFVuaW9uXG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgY3VycmVudCByZWFkZXJzIGlzIG5vdCB0aGUgdW5pb24gdGhhbiBpdCBkb2VzIG5vdFxuICAgICAgICAvLyBzYXRpc2Z5IGN1cnJlbnR5IHJlYWRlci4gVGhlcmUgZm9yIHdlIHVwZGF0ZSByZWFkZXJzXG4gICAgICAgIC8vIGFuZCB1bnNldCBhIHR5cGUuXG4gICAgICAgIGVsc2UgaWYgKHZhcmlhbnRVbmlvbiAhPT0gdmFyaWFudHMpIHtcbiAgICAgICAgICB0eXBlID0gbnVsbFxuICAgICAgICAgIHZhcmlhbnRzID0gdmFyaWFudFVuaW9uXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR5cGUgPSBudWxsXG4gICAgICAgIHZhcmlhbnRzLnB1c2godmFyaWFudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbmRleCA9IGluZGV4ICsgMVxuICB9XG5cbiAgcmV0dXJuIHR5cGUgPyB0eXBlIDogbmV3IFVuaW9uVHlwZSh2YXJpYW50cylcbn1cblVuaW9uLlR5cGUgPSBVbmlvblR5cGVcblxuXG5UeXBlZC5OdW1iZXIuUmFuZ2UgPSAoZnJvbSwgdG89K0luZmluaXR5LCBkZWZhdWx0VmFsdWUpID0+XG4gIFR5cGVkKGBUeXBlZC5OdW1iZXIuUmFuZ2UoJHtmcm9tfS4uJHt0b30pYCwgdmFsdWUgPT4ge1xuICAgIGlmICh0eXBlb2YodmFsdWUpICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIFR5cGVFcnJvcihgXCIke3ZhbHVlfVwiIGlzIG5vdCBhIG51bWJlcmApXG4gICAgfVxuXG4gICAgaWYgKCEodmFsdWUgPj0gZnJvbSAmJiB2YWx1ZSA8PSB0bykpIHtcbiAgICAgIHJldHVybiBUeXBlRXJyb3IoYFwiJHt2YWx1ZX1cIiBpc24ndCBpbiB0aGUgcmFuZ2Ugb2YgJHtmcm9tfS4uJHt0b31gKVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9LCBkZWZhdWx0VmFsdWUpXG4iXX0=
