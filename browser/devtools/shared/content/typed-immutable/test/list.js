(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./test", "immutable", "../record", "../list", "../typed"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./test"), require("immutable"), require("../record"), require("../list"), require("../typed"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.test, global.Immutable, global.record, global.list, global.typed);
    global.list = mod.exports;
  }
})(this, function (exports, _test, _immutable, _record, _list, _typed) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  var NumberList = (0, _list.List)(Number);
  var StringList = (0, _list.List)(String);
  var Point = (0, _record.Record)({ x: Number(0),
    y: Number(0) }, 'Point');

  var Points = (0, _list.List)(Point, 'Points');

  var isUpperCase = function isUpperCase(x) {
    return x.toUpperCase() === x;
  };
  var upperCase = function upperCase(x) {
    return x.toUpperCase();
  };
  var inc = function inc(x) {
    return x + 1;
  };
  var isEvent = function isEvent(x) {
    return x % 2 === 0;
  };
  var sum = function sum(x, y) {
    return x + y;
  };
  var concat = function concat(xs, ys) {
    return xs.concat(ys);
  };

  (0, _test["default"])("typed list creation", function (assert) {

    assert.throws(function (_) {
      return (0, _list.List)();
    }, /Typed.List must be passed a type descriptor/);

    assert.throws(function (_) {
      return (0, _list.List)({});
    }, /Typed.List was passed an invalid type descriptor:/);
  });

  (0, _test["default"])("number list", function (assert) {
    var ns1 = NumberList();
    assert.ok(ns1 instanceof _immutable.List);
    assert.ok(ns1 instanceof _list.List);
    assert.ok(ns1 instanceof NumberList);
    assert.equal(ns1.size, 0);

    var ns2 = ns1.push(5);
    assert.ok(ns1 instanceof _immutable.List);
    assert.ok(ns1 instanceof _list.List);
    assert.ok(ns1 instanceof NumberList);
    assert.equal(ns2.size, 1);
    assert.equal(ns2.get(0), 5);
    assert.equal(ns2.first(), 5);
    assert.equal(ns2.last(), 5);
  });

  (0, _test["default"])("empty record list", function (assert) {
    var v = Points();

    assert.ok(v instanceof _immutable.List);
    assert.ok(v instanceof _list.List);
    assert.ok(v instanceof Points);

    assert.equal(v.size, 0);
  });

  (0, _test["default"])("make list as function call", function (assert) {
    var v = Points([{ x: 1 }]);

    assert.ok(v instanceof _immutable.List);
    assert.ok(v instanceof _list.List);
    assert.ok(v instanceof Points);

    assert.equal(v.size, 1);

    assert.ok(v.get(0) instanceof _record.Record);
    assert.ok(v.get(0) instanceof Point);
    assert.deepEqual(v.toJSON(), [{ x: 1, y: 0 }]);
  });

  (0, _test["default"])("make list of records", function (assert) {
    var v = Points.of({ x: 10 }, { x: 15 }, { x: 17 });
    assert.ok(v instanceof _immutable.List);
    assert.ok(v instanceof _list.List);
    assert.ok(v instanceof Points);

    assert.equal(v.size, 3);

    assert.ok(v.get(0) instanceof _record.Record);
    assert.ok(v.get(0) instanceof Point);

    assert.ok(v.get(1) instanceof _record.Record);
    assert.ok(v.get(1) instanceof Point);

    assert.ok(v.get(2) instanceof _record.Record);
    assert.ok(v.get(2) instanceof Point);

    assert.deepEqual(v.toJSON(), [{ x: 10, y: 0 }, { x: 15, y: 0 }, { x: 17, y: 0 }]);
  });

  (0, _test["default"])("make list with new", function (assert) {
    var v = new Points([{ x: 3 }]);

    assert.ok(v instanceof _immutable.List);
    assert.ok(v instanceof _list.List);
    assert.ok(v instanceof Points);

    assert.equal(v.size, 1);

    assert.ok(v.get(0) instanceof _record.Record);
    assert.ok(v.get(0) instanceof Point);
    assert.deepEqual(v.toJSON(), [{ x: 3, y: 0 }]);
  });

  (0, _test["default"])("toString on typed list", function (assert) {
    var points = Points.of({ x: 10 }, { y: 2 });
    var numbers = NumberList.of(1, 2, 3);
    var strings = StringList.of("hello", "world");

    assert.equal(points.toString(), "Points([ Point({ \"x\": 10, \"y\": 0 }), Point({ \"x\": 0, \"y\": 2 }) ])");

    assert.equal(numbers.toString(), "Typed.List(Number)([ 1, 2, 3 ])");

    assert.equal(strings.toString(), "Typed.List(String)([ \"hello\", \"world\" ])");
  });

  (0, _test["default"])("create list from entries", function (assert) {
    var ns1 = NumberList.of(1, 2, 3, 4);
    assert.equal(ns1.toString(), "Typed.List(Number)([ 1, 2, 3, 4 ])");
    assert.equal(ns1[_typed.Typed.typeName](), "Typed.List(Number)");

    assert.deepEqual(ns1.toJSON(), [1, 2, 3, 4]);
  });

  (0, _test["default"])("converts sequences to list", function (assert) {
    var seq = _immutable.Seq([{ x: 1 }, { x: 2 }]);
    var v = Points(seq);

    assert.ok(v instanceof _immutable.List);
    assert.ok(v instanceof _list.List);
    assert.ok(v instanceof Points);

    assert.equal(v.size, 2);

    assert.ok(v.get(0) instanceof _record.Record);
    assert.ok(v.get(0) instanceof Point);
    assert.ok(v.get(1) instanceof _record.Record);
    assert.ok(v.get(1) instanceof Point);

    assert.deepEqual(v.toJSON(), [{ x: 1, y: 0 }, { x: 2, y: 0 }]);
  });

  (0, _test["default"])("can be subclassed", function (assert) {
    var Graph = (function (_Points) {
      _inherits(Graph, _Points);

      function Graph() {
        _classCallCheck(this, Graph);

        _get(Object.getPrototypeOf(Graph.prototype), "constructor", this).apply(this, arguments);
      }

      _createClass(Graph, [{
        key: "foo",
        value: function foo() {
          var first = this.first();
          var last = this.last();
          return last.x - first.x;
        }
      }]);

      return Graph;
    })(Points);

    var v1 = new Graph([{ y: 3 }, { x: 7 }, { x: 9, y: 4 }]);

    assert.ok(v1 instanceof _immutable.List);
    assert.ok(v1 instanceof _list.List);
    assert.ok(v1 instanceof Points);
    assert.ok(v1 instanceof Graph);

    assert.equal(v1.foo(), 9);
    assert.deepEqual(v1.toJSON(), [{ x: 0, y: 3 }, { x: 7, y: 0 }, { x: 9, y: 4 }]);

    var v2 = v1.set(0, { x: 2, y: 4 });

    assert.ok(v2 instanceof _immutable.List);
    assert.ok(v2 instanceof _list.List);
    assert.ok(v2 instanceof Points);
    assert.ok(v2 instanceof Graph);

    assert.equal(v2.foo(), 7);
    assert.deepEqual(v2.toJSON(), [{ x: 2, y: 4 }, { x: 7, y: 0 }, { x: 9, y: 4 }]);
  });

  (0, _test["default"])("short-circuits if already a list", function (assert) {
    var v1 = Points.of({ x: 2, y: 4 }, { x: 8, y: 3 });

    assert.equal(v1, Points(v1));

    assert.equal(v1, new Points(v1));

    var OtherPoints = (0, _list.List)(Point);

    assert.ok(OtherPoints(v1) instanceof OtherPoints);
    assert.notOk(OtherPoints(v1) instanceof Points);
    assert.notEqual(v1, OtherPoints(v1));
    assert.ok(v1.equals(OtherPoints(v1)));

    assert.ok(new OtherPoints(v1) instanceof OtherPoints);
    assert.notOk(new OtherPoints(v1) instanceof Points);
    assert.notEqual(v1, new OtherPoints(v1));
    assert.ok(v1.equals(new OtherPoints(v1)));

    var SubPoints = (function (_Points2) {
      _inherits(SubPoints, _Points2);

      function SubPoints() {
        _classCallCheck(this, SubPoints);

        _get(Object.getPrototypeOf(SubPoints.prototype), "constructor", this).apply(this, arguments);
      }

      _createClass(SubPoints, [{
        key: "head",
        value: function head() {
          return this.first();
        }
      }]);

      return SubPoints;
    })(Points);

    assert.notEqual(v1, new SubPoints(v1));
    assert.ok(v1.equals(new SubPoints(v1)));

    assert.equal(new SubPoints(v1).head(), v1.first());
  });

  (0, _test["default"])("can be cleared", function (assert) {
    var v1 = Points.of({ x: 1 }, { x: 2 }, { x: 3 });
    var v2 = v1.clear();

    assert.ok(v1 instanceof Points);
    assert.ok(v2 instanceof Points);

    assert.equal(v1.size, 3);
    assert.equal(v2.size, 0);

    assert.deepEqual(v1.toJSON(), [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }]);

    assert.deepEqual(v2.toJSON(), []);

    assert.equal(v2.first(), void 0);
  });

  (0, _test["default"])("can construct records", function (assert) {
    var v1 = Points();
    var v2 = v1.push({ x: 1 });
    var v3 = v2.push({ y: 2 });
    var v4 = v3.push({ x: 3, y: 3 });
    var v5 = v4.push(void 0);

    assert.ok(v1 instanceof Points);
    assert.ok(v2 instanceof Points);
    assert.ok(v3 instanceof Points);
    assert.ok(v4 instanceof Points);
    assert.ok(v5 instanceof Points);

    assert.equal(v1.size, 0);
    assert.equal(v2.size, 1);
    assert.equal(v3.size, 2);
    assert.equal(v4.size, 3);
    assert.equal(v5.size, 4);

    assert.deepEqual(v1.toJSON(), []);
    assert.deepEqual(v2.toJSON(), [{ x: 1, y: 0 }]);
    assert.deepEqual(v3.toJSON(), [{ x: 1, y: 0 }, { x: 0, y: 2 }]);
    assert.deepEqual(v4.toJSON(), [{ x: 1, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 3 }]);
    assert.deepEqual(v5.toJSON(), [{ x: 1, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 3 }, { x: 0, y: 0 }]);
  });

  (0, _test["default"])("can update sub-records", function (assert) {
    var v1 = Points.of({ x: 4 }, { y: 4 });
    var v2 = v1.setIn([0, "y"], 5);
    var v3 = v2.set(2, void 0);
    var v4 = v3.setIn([1, "y"], void 0);

    assert.ok(v1 instanceof Points);
    assert.ok(v2 instanceof Points);
    assert.ok(v3 instanceof Points);
    assert.ok(v4 instanceof Points);

    assert.equal(v1.size, 2);
    assert.equal(v2.size, 2);
    assert.equal(v3.size, 3);
    assert.equal(v4.size, 3);

    assert.deepEqual(v1.toJSON(), [{ x: 4, y: 0 }, { x: 0, y: 4 }]);

    assert.deepEqual(v2.toJSON(), [{ x: 4, y: 5 }, { x: 0, y: 4 }]);

    assert.deepEqual(v3.toJSON(), [{ x: 4, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 0 }]);

    assert.deepEqual(v4.toJSON(), [{ x: 4, y: 5 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
  });

  (0, _test["default"])("serialize & parse", function (assert) {
    var ns1 = NumberList.of(1, 2, 3, 4);

    assert.ok(NumberList(ns1.toJSON()).equals(ns1), "parsing serialized typed list");

    assert.ok(ns1.constructor(ns1.toJSON()).equals(ns1), "parsing with constructor");
  });

  (0, _test["default"])("serialize & parse nested", function (assert) {
    var v1 = Points.of({ x: 1 }, { x: 2 }, { y: 3 });

    assert.ok(Points(v1.toJSON()).equals(v1));
    assert.ok(v1.constructor(v1.toJSON()).equals(v1));
    assert.ok(v1.equals(new Points(v1.toJSON())));

    assert.ok(Points(v1.toJSON()).get(0) instanceof Point);
  });

  (0, _test["default"])("construct with array", function (assert) {
    var ns1 = NumberList([1, 2, 3, 4, 5]);

    assert.ok(ns1 instanceof NumberList);
    assert.ok(ns1.size, 5);
    assert.equal(ns1.get(0), 1);
    assert.equal(ns1.get(1), 2);
    assert.equal(ns1.get(2), 3);
    assert.equal(ns1.get(3), 4);
    assert.equal(ns1.get(4), 5);
  });

  (0, _test["default"])("construct with indexed seq", function (assert) {
    var seq = _immutable.Seq([1, 2, 3]);
    var ns1 = NumberList(seq);

    assert.ok(ns1 instanceof NumberList);
    assert.ok(ns1.size, 3);
    assert.equal(ns1.get(0), 1);
    assert.equal(ns1.get(1), 2);
    assert.equal(ns1.get(2), 3);
  });

  (0, _test["default"])("does not construct form a scalar", function (assert) {
    assert.throws(function (_) {
      return NumberList(3);
    }, /Expected Array or iterable object of values/);
  });

  (0, _test["default"])("can not construct with invalid data", function (assert) {
    var Point = (0, _record.Record)({ x: Number, y: Number }, "Point");
    var Points = (0, _list.List)(Point, "Points");

    assert.throws(function (_) {
      return Points.of({ x: 1, y: 0 }, { y: 2, x: 2 }, { x: 3 });
    }, /"undefined" is not a number/);
  });

  (0, _test["default"])("set and get a value", function (assert) {
    var ns = NumberList();
    var ns2 = ns.set(0, 7);

    assert.equal(ns.size, 0);
    assert.equal(ns.count(), 0);
    assert.equal(ns.get(0), void 0);

    assert.equal(ns2.size, 1);
    assert.equal(ns2.count(), 1);
    assert.equal(ns2.get(0), 7);
  });

  (0, _test["default"])("set and get records", function (assert) {
    var v1 = Points();
    var v2 = v1.set(0, { x: 7 });

    assert.equal(v1.size, 0);
    assert.equal(v1.count(), 0);
    assert.equal(v1.get(0), void 0);

    assert.equal(v2.size, 1);
    assert.equal(v2.count(), 1);
    assert.ok(v2.get(0) instanceof Point);
    assert.ok(v2.get(0).toJSON(), { x: 7, y: 0 });
  });

  (0, _test["default"])("can not set invalid value", function (assert) {
    var ns = NumberList();

    assert.throws(function (_) {
      return ns.set(0, "foo");
    }, /"foo" is not a number/);

    assert.equal(ns.size, 0);
  });

  (0, _test["default"])("can not set invalid structure", function (assert) {
    var v = Points();

    assert.throws(function (_) {
      return v.set(0, 5);
    }, /Invalid data structure/);
  });

  (0, _test["default"])("can not set undeclared fields", function (assert) {
    var v = Points.of({ x: 9 });

    assert.throws(function (_) {
      return v.setIn([0, "d"], 4);
    }, /Cannot set unknown field "d"/);
  });

  (0, _test["default"])("counts from the end of the list on negative index", function (assert) {
    var ns = NumberList.of(1, 2, 3, 4, 5, 6, 7);
    assert.equal(ns.get(-1), 7);
    assert.equal(ns.get(-5), 3);
    assert.equal(ns.get(-9), void 0);
    assert.equal(ns.get(-999, 1000), 1000);
  });

  (0, _test["default"])("coerces numeric-string keys", function (assert) {
    // Of course, TypeScript protects us from this, so cast to "any" to test.
    var ns = NumberList.of(1, 2, 3, 4, 5, 6);

    assert.equal(ns.get('1'), 2);
    assert.equal(ns.get('-1'), 6);
    assert.equal(ns.set('3', 10).get('-3'), 10);
  });

  (0, _test["default"])("setting creates a new instance", function (assert) {
    var v1 = NumberList.of(1);
    var v2 = v1.set(0, 15);

    assert.equal(v1.get(0), 1);
    assert.equal(v2.get(0), 15);

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
  });

  (0, _test["default"])("size includes the highest index", function (assert) {
    var v0 = NumberList();
    var v1 = v0.set(0, 1);
    var v2 = v1.set(1, 2);
    var v3 = v2.set(2, 3);

    assert.equal(v0.size, 0);
    assert.equal(v1.size, 1);
    assert.equal(v2.size, 2);
    assert.equal(v3.size, 3);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
    assert.ok(v3 instanceof NumberList);
  });

  (0, _test["default"])("get helpers make for easier to read code", function (assert) {
    var v1 = NumberList.of(1, 2, 3);

    assert.equal(v1.first(), 1);
    assert.equal(v1.get(1), 2);
    assert.equal(v1.last(), 3);
  });

  (0, _test["default"])('slice helpers make for easier to read code', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = NumberList.of(1, 2);
    var v2 = NumberList.of(1);
    var v3 = NumberList();

    assert.deepEqual(v0.rest().toArray(), [2, 3]);
    assert.ok(v0.rest() instanceof NumberList);
    assert.deepEqual(v0.butLast().toArray(), [1, 2]);
    assert.ok(v0.butLast() instanceof NumberList);

    assert.deepEqual(v1.rest().toArray(), [2]);
    assert.ok(v1.rest() instanceof NumberList);
    assert.deepEqual(v1.butLast().toArray(), [1]);
    assert.ok(v1.butLast() instanceof NumberList);

    assert.deepEqual(v2.rest().toArray(), []);
    assert.ok(v2.rest() instanceof NumberList);
    assert.deepEqual(v2.butLast().toArray(), []);
    assert.ok(v2.butLast() instanceof NumberList);

    assert.deepEqual(v3.rest().toArray(), []);
    assert.ok(v3.rest() instanceof NumberList);
    assert.deepEqual(v3.butLast().toArray(), []);
    assert.ok(v3.butLast() instanceof NumberList);
  });

  (0, _test["default"])('can set at with in the bonds', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.set(1, 20); // within existing tail
    var v2 = v1.set(3, 30); // at last position

    assert.throws(function (_) {
      return v1.set(4, 4);
    }, /Index "4" is out of bound/);
    assert.throws(function (_) {
      return v2.set(31, 31);
    }, /Index "31" is out of bound/);

    assert.equal(v2.size, v1.size + 1);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [1, 20, 3]);
    assert.deepEqual(v2.toArray(), [1, 20, 3, 30]);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
  });

  (0, _test["default"])('can contain a large number of indices', function (assert) {
    var input = _immutable.Range(0, 20000);
    var numbers = NumberList(input);
    var iterations = 0;

    assert.ok(numbers.every(function (value) {
      var result = value === iterations;
      iterations = iterations + 1;
      return result;
    }));
  });

  (0, _test["default"])('push inserts at highest index', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.push(4, 5, 6);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 6);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [1, 2, 3, 4, 5, 6]);
  });

  (0, _test["default"])('pop removes the highest index, decrementing size', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.pop();
    var v2 = v1.push(4);

    assert.equal(v0.last(), 3);
    assert.equal(v0.size, 3);
    assert.deepEqual(v0.toArray(), [1, 2, 3]);

    assert.ok(v1 instanceof NumberList);
    assert.equal(v1.last(), 2);
    assert.equal(v1.size, 2);
    assert.deepEqual(v1.toArray(), [1, 2]);

    assert.ok(v2 instanceof NumberList);
    assert.equal(v2.last(), 4);
    assert.equal(v2.size, 3);
    assert.deepEqual(v2.toArray(), [1, 2, 4]);
  });

  (0, _test["default"])('pop on empty', function (assert) {
    var v0 = NumberList.of(1);
    var v1 = v0.pop();
    var v2 = v1.pop();
    var v3 = v2.pop();
    var v4 = v3.pop();
    var v5 = v4.pop();

    assert.equal(v0.size, 1);
    assert.deepEqual(v0.toArray(), [1]);

    ![v1, v2, v3, v4, v5].forEach(function (v) {
      assert.ok(v instanceof NumberList);
      assert.equal(v.size, 0);
      assert.deepEqual(v.toArray(), []);
    });
  });

  (0, _test["default"])('test removes any index', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.remove(2);
    var v2 = v1.remove(0);
    var v3 = v2.remove(9);
    var v4 = v0.remove(3);
    var v5 = v3.push(5);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
    assert.ok(v3 instanceof NumberList);
    assert.ok(v4 instanceof NumberList);
    assert.ok(v5 instanceof NumberList);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 2);
    assert.equal(v2.size, 1);
    assert.equal(v3.size, 1);
    assert.equal(v4.size, 3);
    assert.equal(v5.size, 2);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [1, 2]);
    assert.deepEqual(v2.toArray(), [2]);
    assert.deepEqual(v3.toArray(), [2]);
    assert.deepEqual(v4.toArray(), [1, 2, 3]);
    assert.deepEqual(v5.toArray(), [2, 5]);
  });

  (0, _test["default"])("shift removes from the front", function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.shift();

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [2, 3]);

    assert.equal(v0.first(), 1);
    assert.equal(v1.first(), 2);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 2);
  });

  (0, _test["default"])("unshift insert items in the front", function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.unshift(11, 12, 13);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [11, 12, 13, 1, 2, 3]);

    assert.equal(v0.first(), 1);
    assert.equal(v1.first(), 11);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 6);
  });

  (0, _test["default"])('finds values using indexOf', function (assert) {
    var v = NumberList.of(1, 2, 3, 2, 1);

    assert.equal(v.indexOf(2), 1);
    assert.equal(v.indexOf(3), 2);
    assert.equal(v.indexOf(4), -1);
  });

  (0, _test["default"])('finds values using findIndex', function (assert) {
    var v = StringList.of('a', 'b', 'c', 'B', 'a');

    assert.equal(v.findIndex(isUpperCase), 3);
    assert.equal(v.findIndex(function (x) {
      return x.length > 1;
    }), -1);
  });

  (0, _test["default"])('finds values using findEntry', function (assert) {
    var v = StringList.of('a', 'b', 'c', 'B', 'a');

    assert.deepEqual(v.findEntry(isUpperCase), [3, 'B']);
    assert.equal(v.findEntry(function (x) {
      return x.length > 1;
    }), void 0);
  });

  (0, _test["default"])('maps values', function (assert) {
    var v0 = NumberList.of(1, 2, 3);
    var v1 = v0.map(inc);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);
    assert.ok(v1 instanceof _immutable.List);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 3);

    assert.deepEqual(v0.toArray(), [1, 2, 3]);
    assert.deepEqual(v1.toArray(), [2, 3, 4]);
  });

  (0, _test["default"])('maps records to any', function (assert) {
    var v0 = Points.of({ x: 1 }, { y: 2 }, { x: 3, y: 3 });
    var v1 = v0.map(function (_ref) {
      var x = _ref.x;
      var y = _ref.y;
      return { x: x + 1, y: y * y };
    });

    assert.ok(v0 instanceof Points);
    assert.notOk(v1 instanceof Points);
    assert.ok(v1 instanceof _immutable.List);
    assert.equal(v1[_typed.Typed.typeName](), 'Typed.List(Any)');

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 3);

    assert.deepEqual(v0.toJSON(), [{ x: 1, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 3 }]);

    assert.deepEqual(v1.toJSON(), [{ x: 2, y: 0 }, { x: 1, y: 4 }, { x: 4, y: 9 }]);
  });

  (0, _test["default"])('maps records to records', function (assert) {
    var v0 = Points.of({ x: 1 }, { y: 2 }, { x: 3, y: 3 });
    var v1 = v0.map(function (point) {
      return point.update('x', inc).update('y', inc);
    });

    assert.ok(v0 instanceof Points);
    assert.ok(v1 instanceof Points);
    assert.ok(v1 instanceof _immutable.List);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 3);

    assert.deepEqual(v0.toJSON(), [{ x: 1, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 3 }]);

    assert.deepEqual(v1.toJSON(), [{ x: 2, y: 1 }, { x: 1, y: 3 }, { x: 4, y: 4 }]);
  });

  (0, _test["default"])('filters values', function (assert) {
    var v0 = NumberList.of(1, 2, 3, 4, 5, 6);
    var v1 = v0.filter(isEvent);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);

    assert.equal(v0.size, 6);
    assert.equal(v1.size, 3);

    assert.deepEqual(v0.toArray(), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(v1.toArray(), [2, 4, 6]);
  });

  (0, _test["default"])('reduces values', function (assert) {
    var v = NumberList.of(1, 10, 100);

    assert.equal(v.reduce(sum), 111);
    assert.equal(v.reduce(sum, 1000), 1111);

    assert.ok(v instanceof NumberList);
    assert.deepEqual(v.toArray(), [1, 10, 100]);
  });

  (0, _test["default"])('reduces from the right', function (assert) {
    var v = StringList.of('a', 'b', 'c');

    assert.equal(v.reduceRight(concat), 'cba');
    assert.equal(v.reduceRight(concat, 'seeded'), 'seededcba');

    assert.ok(v instanceof StringList);
    assert.deepEqual(v.toArray(), ['a', 'b', 'c']);
  });

  (0, _test["default"])('takes and skips values', function (assert) {
    var v0 = NumberList.of(1, 2, 3, 4, 5, 6);
    var v1 = v0.skip(2);
    var v2 = v1.take(2);

    assert.ok(v0 instanceof NumberList);
    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);

    assert.equal(v0.size, 6);
    assert.equal(v1.size, 4);
    assert.equal(v2.size, 2);

    assert.deepEqual(v0.toArray(), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(v1.toArray(), [3, 4, 5, 6]);
    assert.deepEqual(v2.toArray(), [3, 4]);
  });

  (0, _test["default"])('efficiently chains array methods', function (assert) {
    var v = NumberList.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);

    assert.equal(v.filter(function (x) {
      return x % 2 == 0;
    }).skip(2).map(function (x) {
      return x * x;
    }).take(3).reduce(function (a, b) {
      return a + b;
    }, 0), 200);

    assert.ok(v instanceof NumberList);
    assert.equal(v.size, 14);
    assert.deepEqual(v.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  (0, _test["default"])('convert to map', function (assert) {
    var v = StringList.of("a", "b", "c");
    var m = v.toMap();

    assert.ok(v instanceof StringList);
    assert.equal(v.size, 3);
    assert.deepEqual(v.toArray(), ["a", "b", "c"]);

    assert.equal(m.size, 3);
    assert.equal(m.get(1), "b");
  });

  (0, _test["default"])('reverses', function (assert) {
    var v0 = StringList.of("a", "b", "c");
    var v1 = v0.reverse();

    assert.ok(v0 instanceof StringList);
    assert.ok(v1 instanceof StringList);

    assert.equal(v0.size, 3);
    assert.equal(v1.size, 3);

    assert.deepEqual(v0.toArray(), ["a", "b", "c"]);
    assert.deepEqual(v1.toArray(), ["c", "b", "a"]);
  });

  (0, _test["default"])('ensures equality', function (assert) {
    // Make a sufficiently long list.
    var array = Array(100).join('abcdefghijklmnopqrstuvwxyz').split('');

    var v1 = StringList(array);
    var v2 = StringList(array);

    assert.ok(v1 != v2);
    assert.ok(v1.equals(v2));
  });

  (0, _test["default"])('concat works like Array.prototype.concat', function (assert) {
    var v1 = NumberList.of(1, 2, 3);
    var v2 = v1.concat(4, NumberList.of(5, 6), [7, 8], _immutable.Seq({ a: 9, b: 10 }), _immutable.Set.of(11, 12));

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);

    assert.equal(v1.size, 3);
    assert.equal(v2.size, 12);

    assert.deepEqual(v1.toArray(), [1, 2, 3]);
    assert.deepEqual(v2.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  (0, _test["default"])('allows chained mutations', function (assert) {
    var v1 = NumberList();
    var v2 = v1.push(1);
    var v3 = v2.withMutations(function (v) {
      return v.push(2).push(3).push(4);
    });
    var v4 = v3.push(5);

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
    assert.ok(v3 instanceof NumberList);
    assert.ok(v4 instanceof NumberList);

    assert.equal(v1.size, 0);
    assert.equal(v2.size, 1);
    assert.equal(v3.size, 4);
    assert.equal(v4.size, 5);

    assert.deepEqual(v1.toArray(), []);
    assert.deepEqual(v2.toArray(), [1]);
    assert.deepEqual(v3.toArray(), [1, 2, 3, 4]);
    assert.deepEqual(v4.toArray(), [1, 2, 3, 4, 5]);
  });

  (0, _test["default"])('allows chained mutations using alternative API', function (assert) {
    var v1 = NumberList();
    var v2 = v1.push(1);
    var v3 = v2.asMutable().push(2).push(3).push(4).asImmutable();
    var v4 = v3.push(5);

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
    assert.ok(v3 instanceof NumberList);
    assert.ok(v4 instanceof NumberList);

    assert.equal(v1.size, 0);
    assert.equal(v2.size, 1);
    assert.equal(v3.size, 4);
    assert.equal(v4.size, 5);

    assert.deepEqual(v1.toArray(), []);
    assert.deepEqual(v2.toArray(), [1]);
    assert.deepEqual(v3.toArray(), [1, 2, 3, 4]);
    assert.deepEqual(v4.toArray(), [1, 2, 3, 4, 5]);
  });

  (0, _test["default"])('allows size to be set', function (assert) {
    var input = _immutable.Range(0, 2000);
    var v1 = NumberList(input);
    var v2 = v1.setSize(1000);
    assert.throws(function (_) {
      return v2.setSize(1500);
    }, /setSize may only downsize/);
    var v3 = v2.setSize(1000);

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);
    assert.ok(v3 instanceof NumberList);

    assert.equal(v1.size, 2000);
    assert.equal(v2.size, 1000);
    assert.equal(v3.size, 1000);

    assert.equal(v1.get(900), 900);
    assert.equal(v1.get(1300), 1300);
    assert.equal(v1.get(1800), 1800);

    assert.equal(v2.get(900), 900);
    assert.equal(v2.get(1300), void 0);
    assert.equal(v2.get(1800), void 0);

    assert.equal(v3.get(900), 900);
    assert.equal(v3.get(1300), void 0);
    assert.equal(v3.get(1800), void 0);

    assert.ok(v2.equals(v3));
  });

  (0, _test["default"])('can be efficiently sliced', function (assert) {
    var input = _immutable.Range(0, 2000);
    var v1 = NumberList(input);
    var v2 = v1.slice(100, -100);

    assert.ok(v1 instanceof NumberList);
    assert.ok(v2 instanceof NumberList);

    assert.equal(v1.size, 2000);
    assert.equal(v2.size, 1800);

    assert.equal(v2.first(), 100);
    assert.equal(v2.rest().size, 1799);
    assert.equal(v2.last(), 1899);
    assert.equal(v2.butLast().size, 1799);
  });

  var identity = function identity(x) {
    return x;
  };
  (0, _test["default"])('identity preserved on no redundunt changes', function (assert) {
    var ps = Points([{ x: 1 }, { y: 20 }, { x: 3, y: 5 }]);

    assert.equal(ps, ps.set(0, ps.first()));
    assert.equal(ps, ps.set(1, ps.get(1)));
    assert.equal(ps, ps.set(2, ps.get(2)));

    assert.equal(ps.setIn([0, 'x'], 1), ps);
    assert.equal(ps.setIn([0, 'y'], 0), ps);
    assert.equal(ps.setIn([1, 'x'], 0), ps);
    assert.equal(ps.setIn([1, 'y'], 20), ps);
    assert.equal(ps.setIn([2, 'x'], 3), ps);
    assert.equal(ps.setIn([2, 'y'], 5), ps);

    assert.equal(ps.mergeIn([0], { x: 1 }), ps);
    assert.equal(ps.mergeIn([0], { y: 0 }), ps);
    assert.equal(ps.mergeIn([0], { x: 1, y: 0 }), ps);
    assert.equal(ps.mergeIn([1], { x: 0 }), ps);
    assert.equal(ps.mergeIn([1], { y: 20 }), ps);
    assert.equal(ps.mergeIn([1], { x: 0, y: 20 }), ps);
    assert.equal(ps.mergeIn([2], { x: 3 }), ps);
    assert.equal(ps.mergeIn([2], { y: 5 }), ps);
    assert.equal(ps.mergeIn([2], { x: 3, y: 5 }), ps);
  });

  (0, _test["default"])('empty list optimization', function (assert) {
    assert.equal(Points(), Points());
    assert.equal(Points(void 0), Points());
    assert.equal(Points(null), Points());
    assert.equal(Points([]), Points());
    assert.notEqual(Points([Point({ x: 1 })]), Points());
    assert.equal(Points([Point({ x: 1 })]).clear(), Points());
    assert.equal(Points([Point({ x: 1 })]).clear(), Points([Point({ x: 1 }), Point({ y: 2 })]).clear());
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2xpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLE1BQU0sVUFBVSxHQUFHLFVBSFgsSUFBSSxFQUdZLE1BQU0sQ0FBQyxDQUFBO0FBQy9CLE1BQU0sVUFBVSxHQUFHLFVBSlgsSUFBSSxFQUlZLE1BQU0sQ0FBQyxDQUFBO0FBQy9CLE1BQU0sS0FBSyxHQUFHLFlBTk4sTUFBTSxFQU1PLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWixLQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQ2QsT0FBTyxDQUFDLENBQUE7O0FBRTdCLE1BQU0sTUFBTSxHQUFHLFVBVFAsSUFBSSxFQVNRLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFcEMsTUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUcsQ0FBQztXQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO0dBQUEsQ0FBQTtBQUM5QyxNQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxDQUFDO1dBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRTtHQUFBLENBQUE7QUFDdEMsTUFBTSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUcsQ0FBQztXQUFJLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBQTtBQUN0QixNQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBRyxDQUFDO1dBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0dBQUEsQ0FBQTtBQUNoQyxNQUFNLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBQTtBQUMzQixNQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxFQUFFLEVBQUUsRUFBRTtXQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0dBQUEsQ0FBQTs7QUFFeEMsd0JBQUsscUJB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RCxRQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQ1osRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUVsQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFNUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFaEMsUUFBTSxXQUFXLEdBQUcsVUFuTWQsSUFBSSxFQW1NZSxLQUFLLENBQUMsQ0FBQTs7QUFFL0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFlBQVksV0FBVyxDQUFDLENBQUE7QUFDakQsVUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFlBQVksTUFBTSxDQUFDLENBQUE7QUFDL0MsVUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDcEMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXJDLFVBQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLFlBQVksV0FBVyxDQUFDLENBQUE7QUFDckQsVUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUNuRCxVQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O1FBRW5DLFNBQVM7Z0JBQVQsU0FBUzs7ZUFBVCxTQUFTOzhCQUFULFNBQVM7O21DQUFULFNBQVM7OzttQkFBVCxTQUFTOztlQUNULGdCQUFHO0FBQ0wsaUJBQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ3BCOzs7YUFIRyxTQUFTO09BQVMsTUFBTTs7QUFNOUIsVUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUd2QyxVQUFNLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUN4QixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtHQUN6QixDQUFDLENBQUE7O0FBRUYsd0JBQUssZ0JBQWdCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDL0IsUUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ3pDLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFckIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUE7O0FBRS9CLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRXhCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUNYLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV0RCxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFDWCxFQUFFLENBQUMsQ0FBQTs7QUFFcEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FBQTs7QUFFRix3QkFBSyx1QkFBdUIsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUN0QyxRQUFNLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQTtBQUNuQixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7QUFDekIsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ3pCLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQzlCLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBOztBQUUzQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTs7QUFFL0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFeEIsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDakMsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUNWLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUNWLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFDVixFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtHQUM1QyxDQUFDLENBQUE7O0FBRUYsd0JBQUssd0JBQXdCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDdkMsUUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ3BDLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDaEMsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBO0FBQzdCLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBOztBQUV0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTs7QUFFL0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUV4QixVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFDWCxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUNYLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFDVixFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTs7QUFFOUIsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQ1gsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUNWLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUNYLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFDVixFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUNWLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO0dBQy9CLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxtQkFBbUIsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNsQyxRQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUVyQyxVQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQ3BDLCtCQUErQixDQUFDLENBQUE7O0FBRTFDLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQ3pDLDBCQUEwQixDQUFDLENBQUE7R0FDdEMsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLDBCQUEwQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3pDLFFBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFekMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2pELFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTdDLFVBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQTtHQUN2RCxDQUFDLENBQUE7O0FBRUYsd0JBQUssc0JBQXNCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDckMsUUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN0QixVQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNCLFVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzQixVQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0dB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QUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUUzQixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQTs7QUFFaEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNCLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQTtBQUNyQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0dBQzFDLENBQUMsQ0FBQTs7QUFFRix3QkFBSywyQkFBMkIsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUMxQyxRQUFNLEVBQUUsR0FBRyxVQUFVLEVBQUUsQ0FBQTs7QUFFdkIsVUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7S0FBQSxFQUNyQix1QkFBdUIsQ0FBQyxDQUFBOztBQUV0QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDekIsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLCtCQUErQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzlDLFFBQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFBOztBQUVsQixVQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUFBLEVBQ2hCLHdCQUF3QixDQUFDLENBQUE7R0FDeEMsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLCtCQUErQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzlDLFFBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFM0IsVUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUFBLEVBQ3pCLDhCQUE4QixDQUFDLENBQUE7R0FDOUMsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLG1EQUFtRCxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ2xFLFFBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDN0MsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBO0FBQ2pDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUN2QyxDQUFDLENBQUE7O0FBRUYsd0JBQUssNkJBQTZCLEVBQUUsVUFBQSxNQUFNLEVBQUk7O0FBRTVDLFFBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFHMUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUM3QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtHQUM1QyxDQUFDLENBQUE7O0FBRUYsd0JBQUssZ0NBQWdDLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDL0MsUUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzQixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFM0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFD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O0FBQzFDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTs7QUFFN0MsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDNUMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7O0FBRTdDLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzVDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0dBQzlDLENBQUMsQ0FBQTs7QUFFRix3QkFBSyw4QkFBOEIsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUM3QyxRQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDakMsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDeEIsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRXhCLFVBQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQUEsRUFDakIsMkJBQTJCLENBQUMsQ0FBQTtBQUMxQyxVQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUFBLEVBQ25CLDRCQUE0QixDQUFDLENBQUE7O0FBRTNDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUVsQyxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMxQyxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRTlDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0dBQ3BDLENBQUMsQ0FBQTs7QUFJRix3QkFBSyx1Q0FBdUMsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUN0RCxRQUFNLEtBQUssR0FBRyxXQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEMsUUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2pDLFFBQUksVUFBVSxHQUFHLENBQUMsQ0FBQTs7QUFFbEIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQy9CLFVBQU0sTUFBTSxHQUFHLEtBQUssS0FBSyxVQUFVLENBQUE7QUFDbkMsZ0JBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFBO0FBQzNCLGFBQU8sTUFBTSxDQUFBO0tBQ2QsQ0FBQyxDQUFDLENBQUE7R0FDSixDQUFDLENBQUE7O0FBRUYsd0JBQUssK0JBQStCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDOUMsUUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFM0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7O0FBRW5DLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRXhCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ25ELENBQUMsQ0FBQTs7QUFFRix3QkFBSyxrREFBa0QsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNqRSxRQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDakMsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBR3JCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFekMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDMUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXRDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLFVBQVUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUMxQyxDQUFDLENBQUE7O0FBRUYsd0JBQUssY0FBYyxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzdCLFFBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0IsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNuQixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDbkIsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs7QUFFbkIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFbkMsS0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDakMsWUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbEMsWUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3ZCLFlBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ2xDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRix3QkFBSyx3QkFBd0IsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUN2QyxRQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDakMsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN2QixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3ZCLFFBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkIsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN2QixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUdyQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTs7QUFFbkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxD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QUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUM5QyxRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzthQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUNoQixNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFbEQsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksV0FBVSxJQUFJLENBQUMsQ0FBQTs7QUFFdkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFeEIsVUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQ1gsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUNWLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQ1YsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTlCLFVBQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUNYLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFDVixFQUFDLENBQUMsRUFBQyxDQUFD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QUVuQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUV6QixVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtHQUN4RSxDQUFDLENBQUE7O0FBRUYsd0JBQUssMEJBQTBCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDekMsUUFBTSxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUE7QUFDdkIsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNyQixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDM0QsUUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFckIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFBVSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksVUFB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TSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVoQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDOUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBOztBQUVuQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDOUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBOztBQUVuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtHQUN6QixDQUFDLENBQUE7O0FBRUYsd0JBQUssMkJBQTJCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDMUMsUUFBTSxLQUFLLEdBQUcsV0FBVSxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3RDLFFBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUU3QixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxVQUFVLENBQUMsQ0FBQTs7QUFFbkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzNCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFM0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDN0IsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2xDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzdCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUN0QyxDQUFDLENBQUE7O0FBRUYsTUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUcsQ0FBQztXQUFJLENBQUM7R0FBQSxDQUFBO0FBQ3ZCLHdCQUFLLDRDQUE0QyxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzNELFFBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBOztBQUdsRCxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV0QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDeEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFdkMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMvQyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2hELFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7R0FDaEQsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLHlCQUF5QixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3hDLFVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUNoQyxVQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDbEMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUNsRCxVQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZELFVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUMvQixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtHQUM3RCxDQUFDLENBQUEiLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gXCIuL3Rlc3RcIlxuaW1wb3J0ICogYXMgSW1tdXRhYmxlIGZyb20gXCJpbW11dGFibGVcIlxuaW1wb3J0IHtSZWNvcmR9IGZyb20gXCIuLi9yZWNvcmRcIlxuaW1wb3J0IHtMaXN0fSBmcm9tIFwiLi4vbGlzdFwiXG5pbXBvcnQge1R5cGVkLCBVbmlvbiwgTWF5YmV9IGZyb20gXCIuLi90eXBlZFwiXG5cbmNvbnN0IE51bWJlckxpc3QgPSBMaXN0KE51bWJlcilcbmNvbnN0IFN0cmluZ0xpc3QgPSBMaXN0KFN0cmluZylcbmNvbnN0IFBvaW50ID0gUmVjb3JkKHt4OiBOdW1iZXIoMCksXG4gICAgICAgICAgICAgICAgICAgICAgeTogTnVtYmVyKDApfSxcbiAgICAgICAgICAgICAgICAgICAgICdQb2ludCcpXG5cbmNvbnN0IFBvaW50cyA9IExpc3QoUG9pbnQsICdQb2ludHMnKVxuXG5jb25zdCBpc1VwcGVyQ2FzZSA9IHggPT4geC50b1VwcGVyQ2FzZSgpID09PSB4XG5jb25zdCB1cHBlckNhc2UgPSB4ID0+IHgudG9VcHBlckNhc2UoKVxuY29uc3QgaW5jID0geCA9PiB4ICsgMVxuY29uc3QgaXNFdmVudCA9IHggPT4geCAlIDIgPT09IDBcbmNvbnN0IHN1bSA9ICh4LCB5KSA9PiB4ICsgeVxuY29uc3QgY29uY2F0ID0gKHhzLCB5cykgPT4geHMuY29uY2F0KHlzKVxuXG50ZXN0KFwidHlwZWQgbGlzdCBjcmVhdGlvblwiLCBhc3NlcnQgPT4ge1xuXG4gIGFzc2VydC50aHJvd3MoXyA9PiBMaXN0KCksXG4gICAgICAgICAgICAgICAgL1R5cGVkLkxpc3QgbXVzdCBiZSBwYXNzZWQgYSB0eXBlIGRlc2NyaXB0b3IvKVxuXG4gIGFzc2VydC50aHJvd3MoXyA9PiBMaXN0KHt9KSxcbiAgICAgICAgICAgICAgICAvVHlwZWQuTGlzdCB3YXMgcGFzc2VkIGFuIGludmFsaWQgdHlwZSBkZXNjcmlwdG9yOi8pXG59KVxuXG50ZXN0KFwibnVtYmVyIGxpc3RcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgbnMxID0gTnVtYmVyTGlzdCgpXG4gIGFzc2VydC5vayhuczEgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0Lm9rKG5zMSBpbnN0YW5jZW9mIExpc3QpXG4gIGFzc2VydC5vayhuczEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQuZXF1YWwobnMxLnNpemUsIDApXG5cbiAgY29uc3QgbnMyID0gbnMxLnB1c2goNSlcbiAgYXNzZXJ0Lm9rKG5zMSBpbnN0YW5jZW9mIEltbXV0YWJsZS5MaXN0KVxuICBhc3NlcnQub2sobnMxIGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKG5zMSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5lcXVhbChuczIuc2l6ZSwgMSlcbiAgYXNzZXJ0LmVxdWFsKG5zMi5nZXQoMCksIDUpXG4gIGFzc2VydC5lcXVhbChuczIuZmlyc3QoKSwgNSlcbiAgYXNzZXJ0LmVxdWFsKG5zMi5sYXN0KCksIDUpXG59KVxuXG50ZXN0KFwiZW1wdHkgcmVjb3JkIGxpc3RcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdiA9IFBvaW50cygpXG5cbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBMaXN0KVxuICBhc3NlcnQub2sodiBpbnN0YW5jZW9mIFBvaW50cylcblxuICBhc3NlcnQuZXF1YWwodi5zaXplLCAwKVxuXG5cbn0pXG5cbnRlc3QoXCJtYWtlIGxpc3QgYXMgZnVuY3Rpb24gY2FsbFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2ID0gUG9pbnRzKFt7eDogMX1dKVxuXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgSW1tdXRhYmxlLkxpc3QpXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBQb2ludHMpXG5cbiAgYXNzZXJ0LmVxdWFsKHYuc2l6ZSwgMSlcblxuICBhc3NlcnQub2sodi5nZXQoMCkgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh2LmdldCgwKSBpbnN0YW5jZW9mIFBvaW50KVxuICBhc3NlcnQuZGVlcEVxdWFsKHYudG9KU09OKCksIFt7eDoxLCB5OjB9XSlcbn0pXG5cbnRlc3QoXCJtYWtlIGxpc3Qgb2YgcmVjb3Jkc1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2ID0gUG9pbnRzLm9mKHt4OjEwfSwge3g6MTV9LCB7eDoxN30pXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgSW1tdXRhYmxlLkxpc3QpXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBQb2ludHMpXG5cbiAgYXNzZXJ0LmVxdWFsKHYuc2l6ZSwgMylcblxuICBhc3NlcnQub2sodi5nZXQoMCkgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh2LmdldCgwKSBpbnN0YW5jZW9mIFBvaW50KVxuXG4gIGFzc2VydC5vayh2LmdldCgxKSBpbnN0YW5jZW9mIFJlY29yZClcbiAgYXNzZXJ0Lm9rKHYuZ2V0KDEpIGluc3RhbmNlb2YgUG9pbnQpXG5cbiAgYXNzZXJ0Lm9rKHYuZ2V0KDIpIGluc3RhbmNlb2YgUmVjb3JkKVxuICBhc3NlcnQub2sodi5nZXQoMikgaW5zdGFuY2VvZiBQb2ludClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYudG9KU09OKCksIFt7eDoxMCwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3g6MTUsIHk6MH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt4OjE3LCB5OjB9XSlcbn0pXG5cbnRlc3QoXCJtYWtlIGxpc3Qgd2l0aCBuZXdcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdiA9IG5ldyBQb2ludHMoW3t4OiAzfV0pXG5cbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBMaXN0KVxuICBhc3NlcnQub2sodiBpbnN0YW5jZW9mIFBvaW50cylcblxuICBhc3NlcnQuZXF1YWwodi5zaXplLCAxKVxuXG4gIGFzc2VydC5vayh2LmdldCgwKSBpbnN0YW5jZW9mIFJlY29yZClcbiAgYXNzZXJ0Lm9rKHYuZ2V0KDApIGluc3RhbmNlb2YgUG9pbnQpXG4gIGFzc2VydC5kZWVwRXF1YWwodi50b0pTT04oKSwgW3t4OjMsIHk6MH1dKVxufSlcblxudGVzdChcInRvU3RyaW5nIG9uIHR5cGVkIGxpc3RcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgcG9pbnRzID0gUG9pbnRzLm9mKHt4OiAxMH0sIHt5OiAyfSlcbiAgY29uc3QgbnVtYmVycyA9IE51bWJlckxpc3Qub2YoMSwgMiwgMylcbiAgY29uc3Qgc3RyaW5ncyA9IFN0cmluZ0xpc3Qub2YoXCJoZWxsb1wiLCBcIndvcmxkXCIpXG5cbiAgYXNzZXJ0LmVxdWFsKHBvaW50cy50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgYFBvaW50cyhbIFBvaW50KHsgXCJ4XCI6IDEwLCBcInlcIjogMCB9KSwgUG9pbnQoeyBcInhcIjogMCwgXCJ5XCI6IDIgfSkgXSlgKVxuXG4gIGFzc2VydC5lcXVhbChudW1iZXJzLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICBgVHlwZWQuTGlzdChOdW1iZXIpKFsgMSwgMiwgMyBdKWApXG5cbiAgYXNzZXJ0LmVxdWFsKHN0cmluZ3MudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgIGBUeXBlZC5MaXN0KFN0cmluZykoWyBcImhlbGxvXCIsIFwid29ybGRcIiBdKWApXG59KVxuXG50ZXN0KFwiY3JlYXRlIGxpc3QgZnJvbSBlbnRyaWVzXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG5zMSA9IE51bWJlckxpc3Qub2YoMSwgMiwgMywgNClcbiAgYXNzZXJ0LmVxdWFsKG5zMS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgXCJUeXBlZC5MaXN0KE51bWJlcikoWyAxLCAyLCAzLCA0IF0pXCIpXG4gIGFzc2VydC5lcXVhbChuczFbVHlwZWQudHlwZU5hbWVdKCksXG4gICAgICAgICAgICAgICBcIlR5cGVkLkxpc3QoTnVtYmVyKVwiKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwobnMxLnRvSlNPTigpLFxuICAgICAgICAgICAgICAgICAgIFsxLCAyLCAzLCA0XSlcbn0pXG5cbnRlc3QoXCJjb252ZXJ0cyBzZXF1ZW5jZXMgdG8gbGlzdFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBzZXEgPSBJbW11dGFibGUuU2VxKFt7eDogMX0sIHt4OiAyfV0pXG4gIGNvbnN0IHYgPSBQb2ludHMoc2VxKVxuXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgSW1tdXRhYmxlLkxpc3QpXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBQb2ludHMpXG5cbiAgYXNzZXJ0LmVxdWFsKHYuc2l6ZSwgMilcblxuICBhc3NlcnQub2sodi5nZXQoMCkgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh2LmdldCgwKSBpbnN0YW5jZW9mIFBvaW50KVxuICBhc3NlcnQub2sodi5nZXQoMSkgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh2LmdldCgxKSBpbnN0YW5jZW9mIFBvaW50KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodi50b0pTT04oKSwgW3t4OjEsIHk6MH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt4OjIsIHk6MH1dKVxufSlcblxudGVzdChcImNhbiBiZSBzdWJjbGFzc2VkXCIsIGFzc2VydCA9PiB7XG4gIGNsYXNzIEdyYXBoIGV4dGVuZHMgUG9pbnRzIHtcbiAgICBmb28oKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IHRoaXMuZmlyc3QoKVxuICAgICAgY29uc3QgbGFzdCA9IHRoaXMubGFzdCgpXG4gICAgICByZXR1cm4gbGFzdC54IC0gZmlyc3QueFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHYxID0gbmV3IEdyYXBoKFt7eTozfSx7eDo3fSx7eDo5LCB5OjR9XSlcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBHcmFwaClcblxuICBhc3NlcnQuZXF1YWwodjEuZm9vKCksIDkpXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9KU09OKCksXG4gICAgICAgICAgICAgICAgICAgW3t4OjAsIHk6M30sXG4gICAgICAgICAgICAgICAgICAgIHt4OjcsIHk6MH0sXG4gICAgICAgICAgICAgICAgICAgIHt4OjksIHk6NH1dKVxuXG4gIGNvbnN0IHYyID0gdjEuc2V0KDAsIHt4OiAyLCB5OiA0fSlcblxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBHcmFwaClcblxuICBhc3NlcnQuZXF1YWwodjIuZm9vKCksIDcpXG4gIGFzc2VydC5kZWVwRXF1YWwodjIudG9KU09OKCksXG4gICAgICAgICAgICAgICAgICAgW3t4OjIsIHk6NH0sXG4gICAgICAgICAgICAgICAgICAgIHt4OjcsIHk6MH0sXG4gICAgICAgICAgICAgICAgICAgIHt4OjksIHk6NH1dKVxufSlcblxudGVzdChcInNob3J0LWNpcmN1aXRzIGlmIGFscmVhZHkgYSBsaXN0XCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYxID0gUG9pbnRzLm9mKHt4OiAyLCB5OiA0fSxcbiAgICAgICAgICAgICAgICAgICAgICAge3g6IDgsIHk6IDN9KVxuXG4gIGFzc2VydC5lcXVhbCh2MSwgUG9pbnRzKHYxKSlcblxuICBhc3NlcnQuZXF1YWwodjEsIG5ldyBQb2ludHModjEpKVxuXG4gIGNvbnN0IE90aGVyUG9pbnRzID0gTGlzdChQb2ludClcblxuICBhc3NlcnQub2soT3RoZXJQb2ludHModjEpIGluc3RhbmNlb2YgT3RoZXJQb2ludHMpXG4gIGFzc2VydC5ub3RPayhPdGhlclBvaW50cyh2MSkgaW5zdGFuY2VvZiBQb2ludHMpXG4gIGFzc2VydC5ub3RFcXVhbCh2MSwgT3RoZXJQb2ludHModjEpKVxuICBhc3NlcnQub2sodjEuZXF1YWxzKE90aGVyUG9pbnRzKHYxKSkpXG5cbiAgYXNzZXJ0Lm9rKG5ldyBPdGhlclBvaW50cyh2MSkgaW5zdGFuY2VvZiBPdGhlclBvaW50cylcbiAgYXNzZXJ0Lm5vdE9rKG5ldyBPdGhlclBvaW50cyh2MSkgaW5zdGFuY2VvZiBQb2ludHMpXG4gIGFzc2VydC5ub3RFcXVhbCh2MSwgbmV3IE90aGVyUG9pbnRzKHYxKSlcbiAgYXNzZXJ0Lm9rKHYxLmVxdWFscyhuZXcgT3RoZXJQb2ludHModjEpKSlcblxuICBjbGFzcyBTdWJQb2ludHMgZXh0ZW5kcyBQb2ludHMge1xuICAgIGhlYWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXJzdCgpXG4gICAgfVxuICB9XG5cbiAgYXNzZXJ0Lm5vdEVxdWFsKHYxLCBuZXcgU3ViUG9pbnRzKHYxKSlcbiAgYXNzZXJ0Lm9rKHYxLmVxdWFscyhuZXcgU3ViUG9pbnRzKHYxKSkpXG5cblxuICBhc3NlcnQuZXF1YWwobmV3IFN1YlBvaW50cyh2MSkuaGVhZCgpLFxuICAgICAgICAgICAgICAgdjEuZmlyc3QoKSlcbn0pXG5cbnRlc3QoXCJjYW4gYmUgY2xlYXJlZFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MSA9IFBvaW50cy5vZih7eDoxfSwge3g6Mn0sIHt4OjN9KVxuICBjb25zdCB2MiA9IHYxLmNsZWFyKClcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBQb2ludHMpXG4gIGFzc2VydC5vayh2MiBpbnN0YW5jZW9mIFBvaW50cylcblxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYyLnNpemUsIDApXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbe3g6MSwgeTowfSwge3g6MiwgeTowfSwge3g6MywgeTowfV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbXSlcblxuICBhc3NlcnQuZXF1YWwodjIuZmlyc3QoKSwgdm9pZCgwKSlcbn0pXG5cbnRlc3QoXCJjYW4gY29uc3RydWN0IHJlY29yZHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjEgPSBQb2ludHMoKVxuICBjb25zdCB2MiA9IHYxLnB1c2goe3g6MX0pXG4gIGNvbnN0IHYzID0gdjIucHVzaCh7eToyfSlcbiAgY29uc3QgdjQgPSB2My5wdXNoKHt4OjMsIHk6M30pXG4gIGNvbnN0IHY1ID0gdjQucHVzaCh2b2lkKDApKVxuXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIFBvaW50cylcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjMgaW5zdGFuY2VvZiBQb2ludHMpXG4gIGFzc2VydC5vayh2NCBpbnN0YW5jZW9mIFBvaW50cylcbiAgYXNzZXJ0Lm9rKHY1IGluc3RhbmNlb2YgUG9pbnRzKVxuXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAwKVxuICBhc3NlcnQuZXF1YWwodjIuc2l6ZSwgMSlcbiAgYXNzZXJ0LmVxdWFsKHYzLnNpemUsIDIpXG4gIGFzc2VydC5lcXVhbCh2NC5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodjUuc2l6ZSwgNClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvSlNPTigpLCBbXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi50b0pTT04oKSwgW3t4OjEsIHk6MH1dKVxuICBhc3NlcnQuZGVlcEVxdWFsKHYzLnRvSlNPTigpLCBbe3g6MSwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt4OjAsIHk6Mn1dKVxuICBhc3NlcnQuZGVlcEVxdWFsKHY0LnRvSlNPTigpLCBbe3g6MSwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt4OjAsIHk6Mn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eDozLCB5OjN9XSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2NS50b0pTT04oKSwgW3t4OjEsIHk6MH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3g6MywgeTozfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt4OjAsIHk6MH1dKVxufSlcblxudGVzdChcImNhbiB1cGRhdGUgc3ViLXJlY29yZHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjEgPSBQb2ludHMub2Yoe3g6IDR9LCB7eTogNH0pXG4gIGNvbnN0IHYyID0gdjEuc2V0SW4oWzAsIFwieVwiXSwgNSlcbiAgY29uc3QgdjMgPSB2Mi5zZXQoMiwgdm9pZCgwKSlcbiAgY29uc3QgdjQgPSB2My5zZXRJbihbMSwgXCJ5XCJdLCB2b2lkKDApKVxuXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIFBvaW50cylcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjMgaW5zdGFuY2VvZiBQb2ludHMpXG4gIGFzc2VydC5vayh2NCBpbnN0YW5jZW9mIFBvaW50cylcblxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMilcbiAgYXNzZXJ0LmVxdWFsKHYyLnNpemUsIDIpXG4gIGFzc2VydC5lcXVhbCh2My5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodjQuc2l6ZSwgMylcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvSlNPTigpLFxuICAgICAgICAgICAgICAgICAgIFt7eDo0LCB5OjB9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjR9XSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYyLnRvSlNPTigpLFxuICAgICAgICAgICAgICAgICAgIFt7eDo0LCB5OjV9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjR9XSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYzLnRvSlNPTigpLFxuICAgICAgICAgICAgICAgICAgIFt7eDo0LCB5OjV9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjR9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjB9XSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHY0LnRvSlNPTigpLFxuICAgICAgICAgICAgICAgICAgIFt7eDo0LCB5OjV9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjB9LFxuICAgICAgICAgICAgICAgICAgICB7eDowLCB5OjB9XSlcbn0pXG5cbnRlc3QoXCJzZXJpYWxpemUgJiBwYXJzZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBuczEgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMsIDQpXG5cbiAgYXNzZXJ0Lm9rKE51bWJlckxpc3QobnMxLnRvSlNPTigpKS5lcXVhbHMobnMxKSxcbiAgICAgICAgICAgIFwicGFyc2luZyBzZXJpYWxpemVkIHR5cGVkIGxpc3RcIilcblxuICBhc3NlcnQub2sobnMxLmNvbnN0cnVjdG9yKG5zMS50b0pTT04oKSkuZXF1YWxzKG5zMSksXG4gICAgICAgICAgICBcInBhcnNpbmcgd2l0aCBjb25zdHJ1Y3RvclwiKVxufSlcblxudGVzdChcInNlcmlhbGl6ZSAmIHBhcnNlIG5lc3RlZFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MSA9IFBvaW50cy5vZih7eDoxfSwge3g6Mn0sIHt5OjN9KVxuXG4gIGFzc2VydC5vayhQb2ludHModjEudG9KU09OKCkpLmVxdWFscyh2MSkpXG4gIGFzc2VydC5vayh2MS5jb25zdHJ1Y3Rvcih2MS50b0pTT04oKSkuZXF1YWxzKHYxKSlcbiAgYXNzZXJ0Lm9rKHYxLmVxdWFscyhuZXcgUG9pbnRzKHYxLnRvSlNPTigpKSkpXG5cbiAgYXNzZXJ0Lm9rKFBvaW50cyh2MS50b0pTT04oKSkuZ2V0KDApIGluc3RhbmNlb2YgUG9pbnQpXG59KVxuXG50ZXN0KFwiY29uc3RydWN0IHdpdGggYXJyYXlcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgbnMxID0gTnVtYmVyTGlzdChbMSwgMiwgMywgNCwgNV0pXG5cbiAgYXNzZXJ0Lm9rKG5zMSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayhuczEuc2l6ZSwgNSlcbiAgYXNzZXJ0LmVxdWFsKG5zMS5nZXQoMCksIDEpXG4gIGFzc2VydC5lcXVhbChuczEuZ2V0KDEpLCAyKVxuICBhc3NlcnQuZXF1YWwobnMxLmdldCgyKSwgMylcbiAgYXNzZXJ0LmVxdWFsKG5zMS5nZXQoMyksIDQpXG4gIGFzc2VydC5lcXVhbChuczEuZ2V0KDQpLCA1KVxufSlcblxudGVzdChcImNvbnN0cnVjdCB3aXRoIGluZGV4ZWQgc2VxXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHNlcSA9IEltbXV0YWJsZS5TZXEoWzEsIDIsIDNdKVxuICBjb25zdCBuczEgPSBOdW1iZXJMaXN0KHNlcSlcblxuICBhc3NlcnQub2sobnMxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKG5zMS5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwobnMxLmdldCgwKSwgMSlcbiAgYXNzZXJ0LmVxdWFsKG5zMS5nZXQoMSksIDIpXG4gIGFzc2VydC5lcXVhbChuczEuZ2V0KDIpLCAzKVxufSlcblxudGVzdChcImRvZXMgbm90IGNvbnN0cnVjdCBmb3JtIGEgc2NhbGFyXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC50aHJvd3MoXyA9PiBOdW1iZXJMaXN0KDMpLFxuICAgICAgICAgICAgICAgIC9FeHBlY3RlZCBBcnJheSBvciBpdGVyYWJsZSBvYmplY3Qgb2YgdmFsdWVzLylcbn0pXG5cblxudGVzdChcImNhbiBub3QgY29uc3RydWN0IHdpdGggaW52YWxpZCBkYXRhXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IFBvaW50ID0gUmVjb3JkKHt4Ok51bWJlciwgeTpOdW1iZXJ9LCBcIlBvaW50XCIpXG4gIGNvbnN0IFBvaW50cyA9IExpc3QoUG9pbnQsIFwiUG9pbnRzXCIpXG5cbiAgYXNzZXJ0LnRocm93cyhfID0+IFBvaW50cy5vZih7eDoxLCB5OjB9LCB7eToyLCB4OjJ9LCB7eDozfSksXG4gICAgICAgICAgICAgICAgL1widW5kZWZpbmVkXCIgaXMgbm90IGEgbnVtYmVyLylcbn0pXG5cbnRlc3QoXCJzZXQgYW5kIGdldCBhIHZhbHVlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG5zID0gTnVtYmVyTGlzdCgpXG4gIGNvbnN0IG5zMiA9IG5zLnNldCgwLCA3KVxuXG4gIGFzc2VydC5lcXVhbChucy5zaXplLCAwKVxuICBhc3NlcnQuZXF1YWwobnMuY291bnQoKSwgMClcbiAgYXNzZXJ0LmVxdWFsKG5zLmdldCgwKSwgdm9pZCgwKSlcblxuICBhc3NlcnQuZXF1YWwobnMyLnNpemUsIDEpXG4gIGFzc2VydC5lcXVhbChuczIuY291bnQoKSwgMSlcbiAgYXNzZXJ0LmVxdWFsKG5zMi5nZXQoMCksIDcpXG59KVxuXG50ZXN0KFwic2V0IGFuZCBnZXQgcmVjb3Jkc1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MSA9IFBvaW50cygpXG4gIGNvbnN0IHYyID0gdjEuc2V0KDAsIHt4Ojd9KVxuXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAwKVxuICBhc3NlcnQuZXF1YWwodjEuY291bnQoKSwgMClcbiAgYXNzZXJ0LmVxdWFsKHYxLmdldCgwKSwgdm9pZCgwKSlcblxuICBhc3NlcnQuZXF1YWwodjIuc2l6ZSwgMSlcbiAgYXNzZXJ0LmVxdWFsKHYyLmNvdW50KCksIDEpXG4gIGFzc2VydC5vayh2Mi5nZXQoMCkgaW5zdGFuY2VvZiBQb2ludClcbiAgYXNzZXJ0Lm9rKHYyLmdldCgwKS50b0pTT04oKSwge3g6NywgeTowfSlcbn0pXG5cbnRlc3QoXCJjYW4gbm90IHNldCBpbnZhbGlkIHZhbHVlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IG5zID0gTnVtYmVyTGlzdCgpXG5cbiAgYXNzZXJ0LnRocm93cyhfID0+IG5zLnNldCgwLCBcImZvb1wiKSxcbiAgICAgICAgICAgICAgICAvXCJmb29cIiBpcyBub3QgYSBudW1iZXIvKVxuXG4gIGFzc2VydC5lcXVhbChucy5zaXplLCAwKVxufSlcblxudGVzdChcImNhbiBub3Qgc2V0IGludmFsaWQgc3RydWN0dXJlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYgPSBQb2ludHMoKVxuXG4gIGFzc2VydC50aHJvd3MoXyA9PiB2LnNldCgwLCA1KSxcbiAgICAgICAgICAgICAgICAvSW52YWxpZCBkYXRhIHN0cnVjdHVyZS8pXG59KVxuXG50ZXN0KFwiY2FuIG5vdCBzZXQgdW5kZWNsYXJlZCBmaWVsZHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdiA9IFBvaW50cy5vZih7eDogOX0pXG5cbiAgYXNzZXJ0LnRocm93cyhfID0+IHYuc2V0SW4oWzAsIFwiZFwiXSwgNCksXG4gICAgICAgICAgICAgICAgL0Nhbm5vdCBzZXQgdW5rbm93biBmaWVsZCBcImRcIi8pXG59KVxuXG50ZXN0KFwiY291bnRzIGZyb20gdGhlIGVuZCBvZiB0aGUgbGlzdCBvbiBuZWdhdGl2ZSBpbmRleFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBucyA9IE51bWJlckxpc3Qub2YoMSwgMiwgMywgNCwgNSwgNiwgNylcbiAgYXNzZXJ0LmVxdWFsKG5zLmdldCgtMSksIDcpXG4gIGFzc2VydC5lcXVhbChucy5nZXQoLTUpLCAzKVxuICBhc3NlcnQuZXF1YWwobnMuZ2V0KC05KSwgdm9pZCgwKSlcbiAgYXNzZXJ0LmVxdWFsKG5zLmdldCgtOTk5LCAxMDAwKSwgMTAwMClcbn0pXG5cbnRlc3QoXCJjb2VyY2VzIG51bWVyaWMtc3RyaW5nIGtleXNcIiwgYXNzZXJ0ID0+IHtcbiAgLy8gT2YgY291cnNlLCBUeXBlU2NyaXB0IHByb3RlY3RzIHVzIGZyb20gdGhpcywgc28gY2FzdCB0byBcImFueVwiIHRvIHRlc3QuXG4gIGNvbnN0IG5zID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzLCA0LCA1LCA2KVxuXG5cbiAgYXNzZXJ0LmVxdWFsKG5zLmdldCgnMScpLCAyKVxuICBhc3NlcnQuZXF1YWwobnMuZ2V0KCctMScpLCA2KVxuICBhc3NlcnQuZXF1YWwobnMuc2V0KCczJywgMTApLmdldCgnLTMnKSwgMTApXG59KVxuXG50ZXN0KFwic2V0dGluZyBjcmVhdGVzIGEgbmV3IGluc3RhbmNlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYxID0gTnVtYmVyTGlzdC5vZigxKVxuICBjb25zdCB2MiA9IHYxLnNldCgwLCAxNSlcblxuICBhc3NlcnQuZXF1YWwodjEuZ2V0KDApLCAxKVxuICBhc3NlcnQuZXF1YWwodjIuZ2V0KDApLCAxNSlcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxufSlcblxudGVzdChcInNpemUgaW5jbHVkZXMgdGhlIGhpZ2hlc3QgaW5kZXhcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjAgPSBOdW1iZXJMaXN0KClcbiAgY29uc3QgdjEgPSB2MC5zZXQoMCwgMSlcbiAgY29uc3QgdjIgPSB2MS5zZXQoMSwgMilcbiAgY29uc3QgdjMgPSB2Mi5zZXQoMiwgMylcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgMClcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDEpXG4gIGFzc2VydC5lcXVhbCh2Mi5zaXplLCAyKVxuICBhc3NlcnQuZXF1YWwodjMuc2l6ZSwgMylcblxuICBhc3NlcnQub2sodjAgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjMgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxufSlcblxudGVzdChcImdldCBoZWxwZXJzIG1ha2UgZm9yIGVhc2llciB0byByZWFkIGNvZGVcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjEgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMpXG5cbiAgYXNzZXJ0LmVxdWFsKHYxLmZpcnN0KCksIDEpXG4gIGFzc2VydC5lcXVhbCh2MS5nZXQoMSksIDIpXG4gIGFzc2VydC5lcXVhbCh2MS5sYXN0KCksIDMpXG59KVxuXG50ZXN0KCdzbGljZSBoZWxwZXJzIG1ha2UgZm9yIGVhc2llciB0byByZWFkIGNvZGUnLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MCA9IE51bWJlckxpc3Qub2YoMSwgMiwgMylcbiAgY29uc3QgdjEgPSBOdW1iZXJMaXN0Lm9mKDEsIDIpXG4gIGNvbnN0IHYyID0gTnVtYmVyTGlzdC5vZigxKVxuICBjb25zdCB2MyA9IE51bWJlckxpc3QoKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjAucmVzdCgpLnRvQXJyYXkoKSwgWzIsIDNdKTtcbiAgYXNzZXJ0Lm9rKHYwLnJlc3QoKSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5kZWVwRXF1YWwodjAuYnV0TGFzdCgpLnRvQXJyYXkoKSwgWzEsIDJdKVxuICBhc3NlcnQub2sodjAuYnV0TGFzdCgpIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnJlc3QoKS50b0FycmF5KCksIFsyXSlcbiAgYXNzZXJ0Lm9rKHYxLnJlc3QoKSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5kZWVwRXF1YWwodjEuYnV0TGFzdCgpLnRvQXJyYXkoKSwgWzFdKVxuICBhc3NlcnQub2sodjEuYnV0TGFzdCgpIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYyLnJlc3QoKS50b0FycmF5KCksIFtdKVxuICBhc3NlcnQub2sodjIucmVzdCgpIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi5idXRMYXN0KCkudG9BcnJheSgpLCBbXSlcbiAgYXNzZXJ0Lm9rKHYyLmJ1dExhc3QoKSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2My5yZXN0KCkudG9BcnJheSgpLCBbXSlcbiAgYXNzZXJ0Lm9rKHYzLnJlc3QoKSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5kZWVwRXF1YWwodjMuYnV0TGFzdCgpLnRvQXJyYXkoKSwgW10pXG4gIGFzc2VydC5vayh2My5idXRMYXN0KCkgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxufSlcblxudGVzdCgnY2FuIHNldCBhdCB3aXRoIGluIHRoZSBib25kcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzKVxuICBjb25zdCB2MSA9IHYwLnNldCgxLCAyMCkgLy8gd2l0aGluIGV4aXN0aW5nIHRhaWxcbiAgY29uc3QgdjIgPSB2MS5zZXQoMywgMzApIC8vIGF0IGxhc3QgcG9zaXRpb25cblxuICBhc3NlcnQudGhyb3dzKF8gPT4gdjEuc2V0KDQsIDQpLFxuICAgICAgICAgICAgICAgIC9JbmRleCBcIjRcIiBpcyBvdXQgb2YgYm91bmQvKVxuICBhc3NlcnQudGhyb3dzKF8gPT4gdjIuc2V0KDMxLCAzMSksXG4gICAgICAgICAgICAgICAgL0luZGV4IFwiMzFcIiBpcyBvdXQgb2YgYm91bmQvKVxuXG4gIGFzc2VydC5lcXVhbCh2Mi5zaXplLCB2MS5zaXplICsgMSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYwLnRvQXJyYXkoKSwgWzEsIDIsIDNdKVxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvQXJyYXkoKSwgWzEsIDIwLCAzXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi50b0FycmF5KCksIFsxLCAyMCwgMywgMzBdKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayh2MiBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG59KVxuXG5cblxudGVzdCgnY2FuIGNvbnRhaW4gYSBsYXJnZSBudW1iZXIgb2YgaW5kaWNlcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGlucHV0ID0gSW1tdXRhYmxlLlJhbmdlKDAsMjAwMDApXG4gIGNvbnN0IG51bWJlcnMgPSBOdW1iZXJMaXN0KGlucHV0KVxuICBsZXQgaXRlcmF0aW9ucyA9IDBcblxuICBhc3NlcnQub2sobnVtYmVycy5ldmVyeSh2YWx1ZSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdmFsdWUgPT09IGl0ZXJhdGlvbnNcbiAgICBpdGVyYXRpb25zID0gaXRlcmF0aW9ucyArIDFcbiAgICByZXR1cm4gcmVzdWx0XG4gIH0pKVxufSlcblxudGVzdCgncHVzaCBpbnNlcnRzIGF0IGhpZ2hlc3QgaW5kZXgnLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MCA9IE51bWJlckxpc3Qub2YoMSwgMiwgMylcbiAgY29uc3QgdjEgPSB2MC5wdXNoKDQsIDUsIDYpXG5cbiAgYXNzZXJ0Lm9rKHYwIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDYpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MC50b0FycmF5KCksIFsxLCAyLCAzXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0FycmF5KCksIFsxLCAyLCAzLCA0LCA1LCA2XSlcbn0pXG5cbnRlc3QoJ3BvcCByZW1vdmVzIHRoZSBoaWdoZXN0IGluZGV4LCBkZWNyZW1lbnRpbmcgc2l6ZScsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzKVxuICBjb25zdCB2MSA9IHYwLnBvcCgpXG4gIGNvbnN0IHYyID0gdjEucHVzaCg0KVxuXG5cbiAgYXNzZXJ0LmVxdWFsKHYwLmxhc3QoKSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYwLnNpemUsIDMpXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbMSwgMiwgM10pXG5cbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0LmVxdWFsKHYxLmxhc3QoKSwgMilcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDIpXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbMSwgMl0pXG5cbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0LmVxdWFsKHYyLmxhc3QoKSwgNClcbiAgYXNzZXJ0LmVxdWFsKHYyLnNpemUsIDMpXG4gIGFzc2VydC5kZWVwRXF1YWwodjIudG9BcnJheSgpLCBbMSwgMiwgNF0pXG59KVxuXG50ZXN0KCdwb3Agb24gZW1wdHknLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MCA9IE51bWJlckxpc3Qub2YoMSlcbiAgY29uc3QgdjEgPSB2MC5wb3AoKVxuICBjb25zdCB2MiA9IHYxLnBvcCgpXG4gIGNvbnN0IHYzID0gdjIucG9wKClcbiAgY29uc3QgdjQgPSB2My5wb3AoKVxuICBjb25zdCB2NSA9IHY0LnBvcCgpXG5cbiAgYXNzZXJ0LmVxdWFsKHYwLnNpemUsIDEpXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbMV0pXG5cbiAgIVt2MSwgdjIsIHYzLCB2NCwgdjVdLmZvckVhY2godiA9PiB7XG4gICAgYXNzZXJ0Lm9rKHYgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICAgIGFzc2VydC5lcXVhbCh2LnNpemUsIDApXG4gICAgYXNzZXJ0LmRlZXBFcXVhbCh2LnRvQXJyYXkoKSwgW10pXG4gIH0pXG59KVxuXG50ZXN0KCd0ZXN0IHJlbW92ZXMgYW55IGluZGV4JywgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjAgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMpXG4gIGNvbnN0IHYxID0gdjAucmVtb3ZlKDIpXG4gIGNvbnN0IHYyID0gdjEucmVtb3ZlKDApXG4gIGNvbnN0IHYzID0gdjIucmVtb3ZlKDkpXG4gIGNvbnN0IHY0ID0gdjAucmVtb3ZlKDMpXG4gIGNvbnN0IHY1ID0gdjMucHVzaCg1KVxuXG5cbiAgYXNzZXJ0Lm9rKHYwIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYzIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHY0IGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHY1IGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDIpXG4gIGFzc2VydC5lcXVhbCh2Mi5zaXplLCAxKVxuICBhc3NlcnQuZXF1YWwodjMuc2l6ZSwgMSlcbiAgYXNzZXJ0LmVxdWFsKHY0LnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbCh2NS5zaXplLCAyKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbMSwgMiwgM10pXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbMSwgMl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjIudG9BcnJheSgpLCBbMl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjMudG9BcnJheSgpLCBbMl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjQudG9BcnJheSgpLCBbMSwgMiwgM10pXG4gIGFzc2VydC5kZWVwRXF1YWwodjUudG9BcnJheSgpLCBbMiwgNV0pXG59KVxuXG50ZXN0KFwic2hpZnQgcmVtb3ZlcyBmcm9tIHRoZSBmcm9udFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2MCA9IE51bWJlckxpc3Qub2YoMSwgMiwgMylcbiAgY29uc3QgdjEgPSB2MC5zaGlmdCgpXG5cbiAgYXNzZXJ0Lm9rKHYwIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbMSwgMiwgM10pXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbMiwgM10pXG5cbiAgYXNzZXJ0LmVxdWFsKHYwLmZpcnN0KCksIDEpXG4gIGFzc2VydC5lcXVhbCh2MS5maXJzdCgpLCAyKVxuXG4gIGFzc2VydC5lcXVhbCh2MC5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMilcbn0pXG5cbnRlc3QoXCJ1bnNoaWZ0IGluc2VydCBpdGVtcyBpbiB0aGUgZnJvbnRcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjAgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMpXG4gIGNvbnN0IHYxID0gdjAudW5zaGlmdCgxMSwgMTIsIDEzKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG5cblxuICBhc3NlcnQuZGVlcEVxdWFsKHYwLnRvQXJyYXkoKSwgWzEsIDIsIDNdKVxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvQXJyYXkoKSwgWzExLCAxMiwgMTMsIDEsIDIsIDNdKVxuXG4gIGFzc2VydC5lcXVhbCh2MC5maXJzdCgpLCAxKVxuICBhc3NlcnQuZXF1YWwodjEuZmlyc3QoKSwgMTEpXG5cbiAgYXNzZXJ0LmVxdWFsKHYwLnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCA2KVxufSlcblxuXG50ZXN0KCdmaW5kcyB2YWx1ZXMgdXNpbmcgaW5kZXhPZicsIGFzc2VydCA9PiB7XG4gIHZhciB2ID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzLCAyLCAxKVxuXG4gIGFzc2VydC5lcXVhbCh2LmluZGV4T2YoMiksIDEpXG4gIGFzc2VydC5lcXVhbCh2LmluZGV4T2YoMyksIDIpXG4gIGFzc2VydC5lcXVhbCh2LmluZGV4T2YoNCksIC0xKVxufSk7XG5cbnRlc3QoJ2ZpbmRzIHZhbHVlcyB1c2luZyBmaW5kSW5kZXgnLCBhc3NlcnQgPT4ge1xuICB2YXIgdiA9IFN0cmluZ0xpc3Qub2YoJ2EnLCAnYicsICdjJywgJ0InLCAnYScpXG5cbiAgYXNzZXJ0LmVxdWFsKHYuZmluZEluZGV4KGlzVXBwZXJDYXNlKSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYuZmluZEluZGV4KHggPT4geC5sZW5ndGggPiAxKSwgLTEpXG59KVxuXG50ZXN0KCdmaW5kcyB2YWx1ZXMgdXNpbmcgZmluZEVudHJ5JywgYXNzZXJ0ID0+IHtcbiAgdmFyIHYgPSBTdHJpbmdMaXN0Lm9mKCdhJywgJ2InLCAnYycsICdCJywgJ2EnKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodi5maW5kRW50cnkoaXNVcHBlckNhc2UpLCBbMywgJ0InXSlcbiAgYXNzZXJ0LmVxdWFsKHYuZmluZEVudHJ5KHggPT4geC5sZW5ndGggPiAxKSwgdm9pZCgwKSlcbn0pXG5cbnRlc3QoJ21hcHMgdmFsdWVzJywgYXNzZXJ0ID0+IHtcbiAgdmFyIHYwID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzKVxuICB2YXIgdjEgPSB2MC5tYXAoaW5jKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIEltbXV0YWJsZS5MaXN0KVxuXG4gIGFzc2VydC5lcXVhbCh2MC5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMylcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYwLnRvQXJyYXkoKSwgWzEsIDIsIDNdKVxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvQXJyYXkoKSwgWzIsIDMsIDRdKVxufSlcblxudGVzdCgnbWFwcyByZWNvcmRzIHRvIGFueScsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gUG9pbnRzLm9mKHt4OjF9LCB7eToyfSwge3g6MywgeTozfSlcbiAgY29uc3QgdjEgPSB2MC5tYXAoKHt4LCB5fSkgPT4gKHt4OiB4KzEsIHk6IHkqeX0pKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIFBvaW50cylcbiAgYXNzZXJ0Lm5vdE9rKHYxIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcbiAgYXNzZXJ0LmVxdWFsKHYxW1R5cGVkLnR5cGVOYW1lXSgpLCAnVHlwZWQuTGlzdChBbnkpJylcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDMpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MC50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbe3g6MSwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MCwgeToyfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MywgeTozfV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbe3g6MiwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MSwgeTo0fSxcbiAgICAgICAgICAgICAgICAgICAge3g6NCwgeTo5fV0pXG59KVxuXG50ZXN0KCdtYXBzIHJlY29yZHMgdG8gcmVjb3JkcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gUG9pbnRzLm9mKHt4OjF9LCB7eToyfSwge3g6MywgeTozfSlcbiAgY29uc3QgdjEgPSB2MC5tYXAocG9pbnQgPT4gcG9pbnQudXBkYXRlKCd4JywgaW5jKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51cGRhdGUoJ3knLCBpbmMpKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIFBvaW50cylcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgUG9pbnRzKVxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBJbW11dGFibGUuTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDMpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MC50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbe3g6MSwgeTowfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MCwgeToyfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MywgeTozfV0pXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0pTT04oKSxcbiAgICAgICAgICAgICAgICAgICBbe3g6MiwgeToxfSxcbiAgICAgICAgICAgICAgICAgICAge3g6MSwgeTozfSxcbiAgICAgICAgICAgICAgICAgICAge3g6NCwgeTo0fV0pXG59KVxuXG5cbnRlc3QoJ2ZpbHRlcnMgdmFsdWVzJywgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjAgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMsIDQsIDUsIDYpXG4gIGNvbnN0IHYxID0gdjAuZmlsdGVyKGlzRXZlbnQpXG5cbiAgYXNzZXJ0Lm9rKHYwIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgNilcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDMpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MC50b0FycmF5KCksIFsxLCAyLCAzLCA0LCA1LCA2XSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0FycmF5KCksIFsyLCA0LCA2XSlcbn0pXG5cbnRlc3QoJ3JlZHVjZXMgdmFsdWVzJywgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdiA9IE51bWJlckxpc3Qub2YoMSwgMTAsIDEwMClcblxuICBhc3NlcnQuZXF1YWwodi5yZWR1Y2Uoc3VtKSwgMTExKVxuICBhc3NlcnQuZXF1YWwodi5yZWR1Y2Uoc3VtLCAxMDAwKSwgMTExMSlcblxuICBhc3NlcnQub2sodiBpbnN0YW5jZW9mIE51bWJlckxpc3QpXG4gIGFzc2VydC5kZWVwRXF1YWwodi50b0FycmF5KCksIFsxLCAxMCwgMTAwXSlcbn0pXG5cbnRlc3QoJ3JlZHVjZXMgZnJvbSB0aGUgcmlnaHQnLCBhc3NlcnQgPT4ge1xuICBjb25zdCB2ID0gU3RyaW5nTGlzdC5vZignYScsJ2InLCdjJylcblxuICBhc3NlcnQuZXF1YWwodi5yZWR1Y2VSaWdodChjb25jYXQpLCAnY2JhJylcbiAgYXNzZXJ0LmVxdWFsKHYucmVkdWNlUmlnaHQoY29uY2F0LCAnc2VlZGVkJyksICdzZWVkZWRjYmEnKVxuXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgU3RyaW5nTGlzdClcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2LnRvQXJyYXkoKSwgWydhJywgJ2InLCAnYyddKVxufSlcblxudGVzdCgndGFrZXMgYW5kIHNraXBzIHZhbHVlcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gTnVtYmVyTGlzdC5vZigxLCAyLCAzLCA0LCA1LCA2KVxuICBjb25zdCB2MSA9IHYwLnNraXAoMilcbiAgY29uc3QgdjIgPSB2MS50YWtlKDIpXG5cbiAgYXNzZXJ0Lm9rKHYwIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjAuc2l6ZSwgNilcbiAgYXNzZXJ0LmVxdWFsKHYxLnNpemUsIDQpXG4gIGFzc2VydC5lcXVhbCh2Mi5zaXplLCAyKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbMSwgMiwgMywgNCwgNSwgNl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbMywgNCwgNSwgNl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjIudG9BcnJheSgpLCBbMywgNF0pXG59KVxuXG50ZXN0KCdlZmZpY2llbnRseSBjaGFpbnMgYXJyYXkgbWV0aG9kcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNClcblxuICBhc3NlcnQuZXF1YWwodi5maWx0ZXIoeCA9PiB4ICUgMiA9PSAwKVxuICAgICAgICAgICAgICAgIC5za2lwKDIpXG4gICAgICAgICAgICAgICAgLm1hcCh4ID0+IHggKiB4KVxuICAgICAgICAgICAgICAgIC50YWtlKDMpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApLFxuICAgICAgICAgICAgICAgMjAwKVxuXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0LmVxdWFsKHYuc2l6ZSwgMTQpXG4gIGFzc2VydC5kZWVwRXF1YWwodi50b0FycmF5KCksXG4gICAgICAgICAgICAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNF0pXG5cbn0pXG5cbnRlc3QoJ2NvbnZlcnQgdG8gbWFwJywgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdiA9IFN0cmluZ0xpc3Qub2YoXCJhXCIsIFwiYlwiLCBcImNcIilcbiAgY29uc3QgbSA9IHYudG9NYXAoKVxuXG4gIGFzc2VydC5vayh2IGluc3RhbmNlb2YgU3RyaW5nTGlzdClcbiAgYXNzZXJ0LmVxdWFsKHYuc2l6ZSwgMylcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2LnRvQXJyYXkoKSwgW1wiYVwiLCBcImJcIiwgXCJjXCJdKVxuXG4gIGFzc2VydC5lcXVhbChtLnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbChtLmdldCgxKSwgXCJiXCIpXG59KVxuXG50ZXN0KCdyZXZlcnNlcycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYwID0gU3RyaW5nTGlzdC5vZihcImFcIiwgXCJiXCIsIFwiY1wiKVxuICBjb25zdCB2MSA9IHYwLnJldmVyc2UoKVxuXG4gIGFzc2VydC5vayh2MCBpbnN0YW5jZW9mIFN0cmluZ0xpc3QpXG4gIGFzc2VydC5vayh2MSBpbnN0YW5jZW9mIFN0cmluZ0xpc3QpXG5cbiAgYXNzZXJ0LmVxdWFsKHYwLnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAzKVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjAudG9BcnJheSgpLCBbXCJhXCIsIFwiYlwiLCBcImNcIl0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbXCJjXCIsIFwiYlwiLCBcImFcIl0pXG59KVxuXG50ZXN0KCdlbnN1cmVzIGVxdWFsaXR5JywgYXNzZXJ0ID0+IHtcbiAgLy8gTWFrZSBhIHN1ZmZpY2llbnRseSBsb25nIGxpc3QuXG4gIGNvbnN0IGFycmF5ID0gQXJyYXkoMTAwKS5qb2luKCdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicpLnNwbGl0KCcnKVxuXG4gIGNvbnN0IHYxID0gU3RyaW5nTGlzdChhcnJheSlcbiAgY29uc3QgdjIgPSBTdHJpbmdMaXN0KGFycmF5KVxuXG4gIGFzc2VydC5vayh2MSAhPSB2MilcbiAgYXNzZXJ0Lm9rKHYxLmVxdWFscyh2MikpXG59KVxuXG50ZXN0KCdjb25jYXQgd29ya3MgbGlrZSBBcnJheS5wcm90b3R5cGUuY29uY2F0JywgYXNzZXJ0ID0+IHtcbiAgY29uc3QgdjEgPSBOdW1iZXJMaXN0Lm9mKDEsIDIsIDMpO1xuICBjb25zdCB2MiA9IHYxLmNvbmNhdCg0LCBOdW1iZXJMaXN0Lm9mKDUsIDYpLCBbNywgOF0sIEltbXV0YWJsZS5TZXEoe2E6OSxiOjEwfSksIEltbXV0YWJsZS5TZXQub2YoMTEsMTIpKTtcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodjIuc2l6ZSwgMTIpXG5cbiAgYXNzZXJ0LmRlZXBFcXVhbCh2MS50b0FycmF5KCksIFsxLCAyLCAzXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi50b0FycmF5KCksIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXSlcbn0pXG5cbnRlc3QoJ2FsbG93cyBjaGFpbmVkIG11dGF0aW9ucycsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYxID0gTnVtYmVyTGlzdCgpXG4gIGNvbnN0IHYyID0gdjEucHVzaCgxKVxuICBjb25zdCB2MyA9IHYyLndpdGhNdXRhdGlvbnModiA9PiB2LnB1c2goMikucHVzaCgzKS5wdXNoKDQpKVxuICBjb25zdCB2NCA9IHYzLnB1c2goNSlcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjMgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjQgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAwKVxuICBhc3NlcnQuZXF1YWwodjIuc2l6ZSwgMSlcbiAgYXNzZXJ0LmVxdWFsKHYzLnNpemUsIDQpXG4gIGFzc2VydC5lcXVhbCh2NC5zaXplLCA1KVxuXG4gIGFzc2VydC5kZWVwRXF1YWwodjEudG9BcnJheSgpLCBbXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2Mi50b0FycmF5KCksIFsxXSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2My50b0FycmF5KCksIFsxLDIsMyw0XSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh2NC50b0FycmF5KCksIFsxLDIsMyw0LDVdKVxufSlcblxudGVzdCgnYWxsb3dzIGNoYWluZWQgbXV0YXRpb25zIHVzaW5nIGFsdGVybmF0aXZlIEFQSScsIGFzc2VydCA9PiB7XG4gIGNvbnN0IHYxID0gTnVtYmVyTGlzdCgpXG4gIGNvbnN0IHYyID0gdjEucHVzaCgxKVxuICBjb25zdCB2MyA9IHYyLmFzTXV0YWJsZSgpLnB1c2goMikucHVzaCgzKS5wdXNoKDQpLmFzSW1tdXRhYmxlKClcbiAgY29uc3QgdjQgPSB2My5wdXNoKDUpXG5cbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYzIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHY0IGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMClcbiAgYXNzZXJ0LmVxdWFsKHYyLnNpemUsIDEpXG4gIGFzc2VydC5lcXVhbCh2My5zaXplLCA0KVxuICBhc3NlcnQuZXF1YWwodjQuc2l6ZSwgNSlcblxuICBhc3NlcnQuZGVlcEVxdWFsKHYxLnRvQXJyYXkoKSwgW10pXG4gIGFzc2VydC5kZWVwRXF1YWwodjIudG9BcnJheSgpLCBbMV0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjMudG9BcnJheSgpLCBbMSwyLDMsNF0pXG4gIGFzc2VydC5kZWVwRXF1YWwodjQudG9BcnJheSgpLCBbMSwyLDMsNCw1XSlcbn0pXG5cbnRlc3QoJ2FsbG93cyBzaXplIHRvIGJlIHNldCcsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGlucHV0ID0gSW1tdXRhYmxlLlJhbmdlKDAsIDIwMDApXG4gIGNvbnN0IHYxID0gTnVtYmVyTGlzdChpbnB1dClcbiAgY29uc3QgdjIgPSB2MS5zZXRTaXplKDEwMDApXG4gIGFzc2VydC50aHJvd3MoXyA9PiB2Mi5zZXRTaXplKDE1MDApLFxuICAgICAgICAgICAgICAgIC9zZXRTaXplIG1heSBvbmx5IGRvd25zaXplLylcbiAgY29uc3QgdjMgPSB2Mi5zZXRTaXplKDEwMDApXG5cbiAgYXNzZXJ0Lm9rKHYxIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYyIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcbiAgYXNzZXJ0Lm9rKHYzIGluc3RhbmNlb2YgTnVtYmVyTGlzdClcblxuICBhc3NlcnQuZXF1YWwodjEuc2l6ZSwgMjAwMClcbiAgYXNzZXJ0LmVxdWFsKHYyLnNpemUsIDEwMDApXG4gIGFzc2VydC5lcXVhbCh2My5zaXplLCAxMDAwKVxuXG4gIGFzc2VydC5lcXVhbCh2MS5nZXQoOTAwKSwgOTAwKVxuICBhc3NlcnQuZXF1YWwodjEuZ2V0KDEzMDApLCAxMzAwKVxuICBhc3NlcnQuZXF1YWwodjEuZ2V0KDE4MDApLCAxODAwKVxuXG4gIGFzc2VydC5lcXVhbCh2Mi5nZXQoOTAwKSwgOTAwKVxuICBhc3NlcnQuZXF1YWwodjIuZ2V0KDEzMDApLCB2b2lkKDApKVxuICBhc3NlcnQuZXF1YWwodjIuZ2V0KDE4MDApLCB2b2lkKDApKVxuXG4gIGFzc2VydC5lcXVhbCh2My5nZXQoOTAwKSwgOTAwKVxuICBhc3NlcnQuZXF1YWwodjMuZ2V0KDEzMDApLCB2b2lkKDApKVxuICBhc3NlcnQuZXF1YWwodjMuZ2V0KDE4MDApLCB2b2lkKDApKVxuXG4gIGFzc2VydC5vayh2Mi5lcXVhbHModjMpKVxufSlcblxudGVzdCgnY2FuIGJlIGVmZmljaWVudGx5IHNsaWNlZCcsIGFzc2VydCA9PiB7XG4gIGNvbnN0IGlucHV0ID0gSW1tdXRhYmxlLlJhbmdlKDAsIDIwMDApXG4gIGNvbnN0IHYxID0gTnVtYmVyTGlzdChpbnB1dClcbiAgY29uc3QgdjIgPSB2MS5zbGljZSgxMDAsLTEwMClcblxuICBhc3NlcnQub2sodjEgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuICBhc3NlcnQub2sodjIgaW5zdGFuY2VvZiBOdW1iZXJMaXN0KVxuXG4gIGFzc2VydC5lcXVhbCh2MS5zaXplLCAyMDAwKVxuICBhc3NlcnQuZXF1YWwodjIuc2l6ZSwgMTgwMClcblxuICBhc3NlcnQuZXF1YWwodjIuZmlyc3QoKSwgMTAwKVxuICBhc3NlcnQuZXF1YWwodjIucmVzdCgpLnNpemUsIDE3OTkpXG4gIGFzc2VydC5lcXVhbCh2Mi5sYXN0KCksIDE4OTkpXG4gIGFzc2VydC5lcXVhbCh2Mi5idXRMYXN0KCkuc2l6ZSwgMTc5OSlcbn0pXG5cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4XG50ZXN0KCdpZGVudGl0eSBwcmVzZXJ2ZWQgb24gbm8gcmVkdW5kdW50IGNoYW5nZXMnLCBhc3NlcnQgPT4ge1xuICBjb25zdCBwcyA9IFBvaW50cyhbe3g6IDF9LCB7eTogMjB9LCB7eDogMywgeTogNX1dKVxuXG5cbiAgYXNzZXJ0LmVxdWFsKHBzLCBwcy5zZXQoMCwgcHMuZmlyc3QoKSkpXG4gIGFzc2VydC5lcXVhbChwcywgcHMuc2V0KDEsIHBzLmdldCgxKSkpXG4gIGFzc2VydC5lcXVhbChwcywgcHMuc2V0KDIsIHBzLmdldCgyKSkpXG5cbiAgYXNzZXJ0LmVxdWFsKHBzLnNldEluKFswLCAneCddLCAxKSwgcHMpXG4gIGFzc2VydC5lcXVhbChwcy5zZXRJbihbMCwgJ3knXSwgMCksIHBzKVxuICBhc3NlcnQuZXF1YWwocHMuc2V0SW4oWzEsICd4J10sIDApLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLnNldEluKFsxLCAneSddLCAyMCksIHBzKVxuICBhc3NlcnQuZXF1YWwocHMuc2V0SW4oWzIsICd4J10sIDMpLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLnNldEluKFsyLCAneSddLCA1KSwgcHMpXG5cbiAgYXNzZXJ0LmVxdWFsKHBzLm1lcmdlSW4oWzBdLCB7eDogMX0pLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLm1lcmdlSW4oWzBdLCB7eTogMH0pLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLm1lcmdlSW4oWzBdLCB7eDogMSwgeTogMH0pLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLm1lcmdlSW4oWzFdLCB7eDogMH0pLCBwcylcbiAgYXNzZXJ0LmVxdWFsKHBzLm1lcmdlSW4oWzFdLCB7eTogMjB9KSwgcHMpXG4gIGFzc2VydC5lcXVhbChwcy5tZXJnZUluKFsxXSwge3g6IDAsIHk6IDIwfSksIHBzKVxuICBhc3NlcnQuZXF1YWwocHMubWVyZ2VJbihbMl0sIHt4OiAzfSksIHBzKVxuICBhc3NlcnQuZXF1YWwocHMubWVyZ2VJbihbMl0sIHt5OiA1fSksIHBzKVxuICBhc3NlcnQuZXF1YWwocHMubWVyZ2VJbihbMl0sIHt4OiAzLCB5OiA1fSksIHBzKVxufSlcblxudGVzdCgnZW1wdHkgbGlzdCBvcHRpbWl6YXRpb24nLCBhc3NlcnQgPT4ge1xuICBhc3NlcnQuZXF1YWwoUG9pbnRzKCksIFBvaW50cygpKVxuICBhc3NlcnQuZXF1YWwoUG9pbnRzKHZvaWQoMCkpLCBQb2ludHMoKSlcbiAgYXNzZXJ0LmVxdWFsKFBvaW50cyhudWxsKSwgUG9pbnRzKCkpXG4gIGFzc2VydC5lcXVhbChQb2ludHMoW10pLCBQb2ludHMoKSlcbiAgYXNzZXJ0Lm5vdEVxdWFsKFBvaW50cyhbUG9pbnQoe3g6IDF9KV0pLCBQb2ludHMoKSlcbiAgYXNzZXJ0LmVxdWFsKFBvaW50cyhbUG9pbnQoe3g6IDF9KV0pLmNsZWFyKCksIFBvaW50cygpKVxuICBhc3NlcnQuZXF1YWwoUG9pbnRzKFtQb2ludCh7eDogMX0pXSkuY2xlYXIoKSxcbiAgICAgICAgICAgICAgIFBvaW50cyhbUG9pbnQoe3g6IDF9KSwgUG9pbnQoe3k6IDJ9KV0pLmNsZWFyKCkpXG59KVxuIl19