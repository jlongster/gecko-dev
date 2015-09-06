(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./test", "immutable", "../record", "../typed"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./test"), require("immutable"), require("../record"), require("../typed"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.test, global.Immutable, global.record, global.typed);
    global.index = mod.exports;
  }
})(this, function (exports, _test, _immutable, _record, _typed) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  (0, _test["default"])("define a constructor", function (assert) {
    var MyType = (0, _record.Record)({ a: Number(1),
      b: Number(2),
      c: Number(3) });

    var t1 = new MyType();
    var t2 = t1.set("a", 10);
    var t3 = t2.clear();

    assert.ok(t1 instanceof _record.Record);
    assert.ok(t1 instanceof MyType);

    assert.ok(t3 instanceof _record.Record);
    assert.ok(t3 instanceof MyType);

    assert.equal(t1.get("a"), 1);
    assert.equal(t2.get("a"), 10);

    assert.equal(t1.size, 3);
    assert.equal(t2.size, 3);
  });

  (0, _test["default"])("passes through records of the same type", function (assert) {
    var P2 = (0, _record.Record)({ x: Number(0), y: Number(0) });
    var P3 = (0, _record.Record)({ x: Number(0), y: Number(0), z: Number(0) });
    var p2 = P2();
    var p3 = P3();
    assert.ok(P3(p2) instanceof P3);
    assert.ok(P2(p3) instanceof P2);
    assert.equal(P2(p2), p2);
    assert.equal(P3(p3), p3);
  });

  (0, _test["default"])("only allows setting what it knows about", function (assert) {
    var MyType = (0, _record.Record)({ a: Number(1),
      b: Number(2),
      c: Number(3) });

    var t1 = new MyType({ a: 10, b: 20 });
    assert.throws(function (_) {
      return t1.set("d", 4);
    }, /Cannot set unknown field "d"/);
  });

  (0, _test["default"])("has a fixed size and falls back to default values", function (assert) {
    var MyType = (0, _record.Record)({ a: Number(1),
      b: Number(2),
      c: Number(3) });

    var t1 = new MyType({ a: 10, b: 20 });
    var t2 = new MyType({ b: 20 });
    var t3 = t1.remove("a");
    var t4 = t3.clear();

    assert.equal(t1.size, 3);
    assert.equal(t2.size, 3);
    assert.equal(t3.size, 3);
    assert.equal(t4.size, 3);

    assert.equal(t1.get("a"), 10);
    assert.equal(t2.get("a"), 1);
    assert.equal(t3.get("a"), 1);
    assert.equal(t4.get("b"), 2);

    assert.ok(t2.equals(t3));
    assert.notOk(t2.equals(t4));
    assert.ok(t4.equals(new MyType()));
  });

  (0, _test["default"])("converts sequences to records", function (assert) {
    var MyType = (0, _record.Record)({ a: 1, b: 2, c: 3 });
    var seq = _immutable.Seq({ a: 10, b: 20 });
    var t = new MyType(seq);
    assert.deepEqual(t.toObject(), { a: 10, b: 20, c: 3 });
  });

  (0, _test["default"])("allows for functional construction", function (assert) {
    var MyType = (0, _record.Record)({ a: 1, b: 2, c: 3 });
    var seq = _immutable.Seq({ a: 10, b: 20 });
    var t = MyType(seq);
    assert.deepEqual(t.toObject(), { a: 10, b: 20, c: 3 });
  });

  (0, _test["default"])("skips unknown keys", function (assert) {
    var MyType = (0, _record.Record)({ a: 1, b: 2 });
    var seq = _immutable.Seq({ b: 20, c: 30 });
    var t = new MyType(seq);

    assert.equal(t.get("a"), 1);
    assert.equal(t.get("b"), 20);
    assert.equal(t.get("c"), void 0);
  });

  (0, _test["default"])("flat record with defaults values", function (assert) {
    var Point = (0, _record.Record)({
      x: Number(0),
      y: Number(0)
    }, "Point");

    var p1 = Point();

    assert.equal(p1.x, 0);
    assert.equal(p1.y, 0);
    assert.equal(JSON.stringify(p1), JSON.stringify({ x: 0, y: 0 }));

    var p2 = Point({ x: 10 });

    assert.equal(p2.x, 10);
    assert.equal(p2.y, 0);
    assert.equal(JSON.stringify(p2), JSON.stringify({ x: 10, y: 0 }));

    var p3 = Point({ x: 1, y: 2 });

    assert.equal(p3.x, 1);
    assert.equal(p3.y, 2);
    assert.equal(JSON.stringify(p3), JSON.stringify({ x: 1, y: 2 }));
  });

  (0, _test["default"])("ignores unknown fields", function (assert) {
    var Point = (0, _record.Record)({
      x: Number(0),
      y: Number(0)
    }, "Point");

    var p1 = Point({ z: 20 });

    assert.equal(p1.z, void 0);
    assert.equal(JSON.stringify(p1), JSON.stringify({ x: 0, y: 0 }));
  });

  (0, _test["default"])("invalid argument passed to a record", function (assert) {
    var Point = (0, _record.Record)({
      x: Number(0),
      y: Number(0)
    }, "Point");

    assert.throws(function () {
      Point(null);
    }, /Invalid data structure "null"/);

    assert.throws(function () {
      Point(7);
    }, /Invalid data structure "7"/);

    assert.throws(function () {
      Point(true);
    }, /Invalid data structure "true"/);

    assert.throws(function () {
      Point("{x: 1}");
    }, /Invalid data structure "{x: 1}"/);
  });

  (0, _test["default"])("flat record without defaults", function (assert) {
    var Point = (0, _record.Record)({
      x: Number,
      y: Number
    }, "Point");

    assert.throws(function () {
      Point();
    }, /Invalid value for "x" field/);

    assert.throws(function () {
      Point({ x: 1 });
    }, /Invalid value for "y" field/);

    var p1 = Point({ x: 0, y: 1 });

    assert.equal(p1.x, 0);
    assert.equal(p1.y, 1);
  });

  (0, _test["default"])("stringify on record", function (assert) {
    var UnlabledPoint = (0, _record.Record)({ x: Number, y: Number });

    assert.equal(UnlabledPoint({ x: 0, y: 0 })[_typed.Typed.typeName](), "Typed.Record({x: Number, y: Number})");

    assert.equal(UnlabledPoint({ x: 4, y: 9 }) + "", "Typed.Record({x: Number, y: Number})({ \"x\": 4, \"y\": 9 })");

    var LabledPoint = (0, _record.Record)({ x: Number, y: Number }, "Point");

    assert.equal(LabledPoint({ x: 0, y: 0 })[_typed.Typed.typeName](), "Point");

    assert.equal(LabledPoint({ x: 4, y: 9 }) + "", "Point({ \"x\": 4, \"y\": 9 })");

    var PointDefaults = (0, _record.Record)({ x: Number(0), y: Number(7) });

    assert.equal(PointDefaults({ x: 5, y: 3 })[_typed.Typed.typeName](), "Typed.Record({x: Number(0), y: Number(7)})");

    assert.equal(PointDefaults({ x: 4, y: 9 }) + "", "Typed.Record({x: Number(0), y: Number(7)})({ \"x\": 4, \"y\": 9 })");

    var LabledPointDefaults = (0, _record.Record)({ x: Number(5), y: Number(9) }, "Point");

    assert.equal(LabledPointDefaults({ x: 0, y: 0 })[_typed.Typed.typeName](), "Point");

    assert.equal(LabledPointDefaults({ x: 4, y: 9 }) + "", "Point({ \"x\": 4, \"y\": 9 })");
  });

  (0, _test["default"])("nested records", function (assert) {
    var Point = (0, _record.Record)({ x: Number(0), y: Number(0) }, "Point");
    var Line = (0, _record.Record)({ begin: Point, end: Point }, "Line");

    assert.equal(Line() + "", "Line({ \"begin\": Point({ \"x\": 0, \"y\": 0 }), \"end\": Point({ \"x\": 0, \"y\": 0 }) })");

    assert.equal(Line({ begin: { x: 5 } }) + "", "Line({ \"begin\": Point({ \"x\": 5, \"y\": 0 }), \"end\": Point({ \"x\": 0, \"y\": 0 }) })");

    assert.equal(Line({ begin: { x: 5 }, end: { y: 7 } }) + "", "Line({ \"begin\": Point({ \"x\": 5, \"y\": 0 }), \"end\": Point({ \"x\": 0, \"y\": 7 }) })");

    var l1 = Line({ begin: { x: 5 }, end: { y: 7 } });

    assert.ok(Line(JSON.parse(JSON.stringify(l1))).equals(l1));

    assert.throws(function () {
      Line({ begin: { x: 5 }, end: null });
    }, /Invalid value for "end" field/);

    assert.throws(function () {
      Line({ begin: { x: 5 }, end: { y: "7" } });
    }, /Invalid value for "y" field/);
  });

  (0, _test["default"])("defines a constructor", function (assert) {
    var Point = (0, _record.Record)({ x: Number(0),
      y: Number(0) });

    var p1 = new Point();
    var p2 = p1.set("x", 10);

    assert.equal(p1.x, 0);
    assert.equal(p2.x, 10);
  });

  (0, _test["default"])("can have mutations apply", function (assert) {
    var Point = (0, _record.Record)({ x: Number(0),
      y: Number(0) });

    var p = new Point();

    assert.throws(function (_) {
      return p.x = 10;
    }, /Cannot set on an immutable record/);

    var p2 = p.withMutations(function (m) {
      m.x = 10;
      m.y = 20;
    });

    assert.equal(p2.x, 10, "x was updated");
    assert.equal(p2.y, 20, "y was updated");
  });

  (0, _test["default"])("can be subclassed", function (assert) {
    var Alphabet = (function (_Record) {
      _inherits(Alphabet, _Record);

      function Alphabet() {
        _classCallCheck(this, Alphabet);

        _get(Object.getPrototypeOf(Alphabet.prototype), "constructor", this).apply(this, arguments);
      }

      _createClass(Alphabet, [{
        key: "soup",
        value: function soup() {
          return this.a + this.b + this.c;
        }
      }]);

      return Alphabet;
    })((0, _record.Record)({ a: Number(1),
      b: Number(2),
      c: Number(3) }));

    var t = new Alphabet();
    var t2 = t.set("b", 200);

    assert.ok(t instanceof _record.Record);
    assert.ok(t instanceof Alphabet);
    assert.equal(t.soup(), 6);

    assert.ok(t2 instanceof _record.Record);
    assert.ok(t2 instanceof Alphabet);
    assert.equal(t2.soup(), 204);
  });

  (0, _test["default"])("short-circuits if already a record", function (assert) {
    var Point = (0, _record.Record)({ x: Number(0), y: Number(0) });
    var p = new Point({ x: 1, y: 2 });

    assert.equal(p, Point(p));
    assert.equal(p, new Point(p));

    var OtherPoint = (0, _record.Record)({ x: Number(0), y: Number(0) });

    assert.notEqual(p, OtherPoint(p));
    assert.ok(p.equals(OtherPoint(p)));
    assert.notEqual(p, new OtherPoint(p));
    assert.ok(p.equals(new OtherPoint(p)));
    assert.equal(OtherPoint(p).x, 1);
    assert.equal(OtherPoint(p).y, 2);

    var SubPoint = (function (_Point) {
      _inherits(SubPoint, _Point);

      function SubPoint() {
        _classCallCheck(this, SubPoint);

        _get(Object.getPrototypeOf(SubPoint.prototype), "constructor", this).apply(this, arguments);
      }

      _createClass(SubPoint, [{
        key: "stringify",
        value: function stringify() {
          return this.x + ":" + this.y;
        }
      }]);

      return SubPoint;
    })(Point);

    assert.notEqual(p, new SubPoint(p));
    assert.ok(p.equals(new SubPoint(p)));

    assert.equal(new SubPoint(p).stringify(), "1:2");
  });

  (0, _test["default"])("can be cleared", function (assert) {
    var Point = (0, _record.Record)({ x: Number(1), y: Number(2) });
    var p = Point({ y: 20 });

    assert.equal(p.x, 1);
    assert.equal(p.y, 20);

    var pc = p.clear();

    assert.equal(pc.x, 1);
    assert.equal(pc.y, 2);
  });

  (0, _test["default"])("can not be cleared when no defaults", function (assert) {
    var Point = (0, _record.Record)({ x: Number, y: Number });
    var p = Point({ x: 1, y: 1 });

    assert.equal(p.x, 1);
    assert.equal(p.y, 1);

    assert.throws(function (_) {
      return p.clear();
    }, /Invalid value for "x" field/);
  });

  (0, _test["default"])("can construct sub-records", function (assert) {
    var Field = (0, _record.Record)({
      value: String(""),
      isFocused: Boolean(false)
    });

    var Login = (0, _record.Record)({
      user: Field,
      password: Field
    });

    var l1 = Login();

    assert.ok(l1.user instanceof Field);
    assert.ok(l1.password instanceof Field);
    assert.ok(l1.user.value === "");
    assert.ok(l1.user.isFocused === false);
    assert.ok(l1.password.value === "");
    assert.ok(l1.password.isFocused === false);

    assert.ok(l1.equals(new Login()));

    var l2 = Login({ user: { value: "gozala" } });

    assert.ok(l2.user instanceof Field);
    assert.ok(l2.password instanceof Field);
    assert.ok(l2.user.value === "gozala");
    assert.ok(l2.user.isFocused === false);
    assert.ok(l2.password.value === "");
    assert.ok(l2.password.isFocused === false);

    var l3 = Login({ user: { value: "gozala" },
      password: { isFocused: true },
      extra: { isFocused: false } });

    assert.ok(l3.user instanceof Field);
    assert.ok(l3.password instanceof Field);
    assert.ok(l3.user.value === "gozala");
    assert.ok(l3.user.isFocused === false);
    assert.ok(l3.password.value === "");
    assert.ok(l3.password.isFocused === true);
    assert.ok(l2.extra === undefined);
  });

  (0, _test["default"])("can update sub-records", function (assert) {
    var Field = (0, _record.Record)({
      value: String(""),
      isFocused: Boolean(false)
    });

    var Login = (0, _record.Record)({
      user: Field,
      password: Field
    });

    var l1 = Login();
    assert.ok(l1.user instanceof Field);
    assert.ok(l1.password instanceof Field);
    assert.ok(l1.user.value === "");
    assert.ok(l1.user.isFocused === false);
    assert.ok(l1.password.value === "");
    assert.ok(l1.password.isFocused === false);

    var l2 = l1.set("user", { value: "gozala" });
    assert.ok(l2.user instanceof Field);
    assert.ok(l2.password instanceof Field);
    assert.ok(l2.user.value === "gozala");
    assert.ok(l2.user.isFocused === false);
    assert.ok(l2.password.value === "");
    assert.ok(l2.password.isFocused === false);

    var l3 = l1.updateIn(["user"], function (_) {
      return { value: "updateIn" };
    });
    assert.ok(l3.user instanceof Field);
    assert.ok(l3.password instanceof Field);
    assert.ok(l3.user.value === "updateIn");
    assert.ok(l3.user.isFocused === false);
    assert.ok(l3.password.value === "");
    assert.ok(l3.password.isFocused === false);

    var l4 = l2.set("user", void 0);
    assert.ok(l4.user instanceof Field);
    assert.ok(l4.password instanceof Field);
    assert.ok(l4.user.value === "");
    assert.ok(l4.user.isFocused === false);
    assert.ok(l4.password.value === "");
    assert.ok(l4.password.isFocused === false);

    var l5 = l1.merge({ user: { value: "merge" } });
    assert.ok(l5.user instanceof Field);
    assert.ok(l5.password instanceof Field);
    assert.ok(l5.user.value === "merge");
    assert.ok(l5.user.isFocused === false);
    assert.ok(l5.password.value === "");
    assert.ok(l5.password.isFocused === false);
  });

  (0, _test["default"])("can use instances as fields", function (assert) {
    var Field = (0, _record.Record)({ isFocused: false,
      value: "" });

    var Login = (0, _record.Record)({ user: Field({ isFocused: true }),
      password: Field });

    var l1 = Login();

    assert.ok(l1.user instanceof Field, 'l1.user is Field instance');
    assert.ok(l1.password instanceof Field, 'l1.password is Field instance');
    assert.ok(l1.user.value === "", 'l1.user.value is ""');
    assert.ok(l1.user.isFocused === true, 'l1.user.isFocused is true');
    assert.ok(l1.password.value === "", 'l1.password.value is ""');
    assert.ok(l1.password.isFocused === false, 'l1.password.isFocused is false');

    var l2 = Login({ user: { isFocused: false, value: "gozala" },
      password: { isFocused: true } });

    assert.ok(l2.user instanceof Field);
    assert.ok(l2.password instanceof Field);
    assert.ok(l2.user.value === "gozala");
    assert.ok(l2.user.isFocused === false);
    assert.ok(l2.password.value === "");
    assert.ok(l2.password.isFocused === true);
  });

  (0, _test["default"])("Maybe type", function (assert) {
    assert.throws(function () {
      (0, _typed.Maybe)({});
    }, /is not a valid/);

    var InputModel = (0, _record.Record)({
      value: (0, _typed.Maybe)(String)
    }, "InputModel");

    assert.equal(InputModel() + "", "InputModel({ \"value\": null })");

    assert.equal(JSON.stringify(InputModel()), JSON.stringify({ value: null }));

    assert.equal(JSON.stringify(InputModel({})), JSON.stringify({ value: null }));

    assert.equal(JSON.stringify(InputModel({ value: null })), JSON.stringify({ value: null }));

    assert.equal(JSON.stringify(InputModel({ value: void 0 })), JSON.stringify({ value: null }));

    assert.throws(function (_) {
      return InputModel({ value: 17 });
    }, /"17" is not nully/);
    assert.throws(function (_) {
      return InputModel({ value: 17 });
    }, /nor it is of String type/);

    var i1 = InputModel({ value: "hello" });

    assert.equal(i1.value, "hello");
    assert.equal(JSON.stringify(i1), JSON.stringify({ value: "hello" }));
    assert.equal(i1 + "", "InputModel({ \"value\": \"hello\" })");
  });

  (0, _test["default"])("Range type", function (assert) {
    var Color = (0, _record.Record)({
      red: _typed.Typed.Number.Range(0, 255, 0),
      green: _typed.Typed.Number.Range(0, 255, 0),
      blue: _typed.Typed.Number.Range(0, 255, 0),
      alpha: (0, _typed.Maybe)(_typed.Typed.Number.Range(0, 100))
    }, "Color");

    assert.equal(Color() + "", "Color({ \"red\": 0, \"green\": 0, \"blue\": 0, \"alpha\": null })");

    assert.throws(function (_) {
      return Color({ alpha: -10 });
    }, /"-10" is not nully/);
    assert.throws(function (_) {
      return Color({ alpha: -10 });
    }, /of Typed.Number.Range\(0\.\.100\) type/);

    assert.equal(Color({ alpha: 20 }) + "", "Color({ \"red\": 0, \"green\": 0, \"blue\": 0, \"alpha\": 20 })");
  });

  (0, _test["default"])("Union type", function (assert) {
    var Status = (0, _record.Record)({
      readyState: (0, _typed.Union)(Number, String)
    });

    assert.throws(function (_) {
      return Status();
    }, /"undefined" does not satisfy Union\(Number, String\)/);

    assert.equal(Status({ readyState: "loading" }).toString(), "Typed.Record({readyState: Union(Number, String)})({ \"readyState\": \"loading\" })");
  });

  (0, _test["default"])("Union of similar records", function (assert) {
    var Add = (0, _record.Record)({ id: Number(0) });
    var Remove = (0, _record.Record)({ id: Number(0) });
    var Action = (0, _record.Record)({ action: (0, _typed.Union)(Add, Remove) });

    var add = Add();
    var remove = Remove();
    var ambigius = { id: 1 };

    assert.equal(Action({ action: add }).action, add, "recognizes Add");
    assert.equal(Action({ action: remove }).action, remove, "recognizes Remove");
    assert.ok(Action({ action: ambigius }).action instanceof Add, "matches Add");
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSx3QkFBSyxzQkFBc0IsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNyQyxRQUFNLE1BQU0sR0FBRyxZQUpULE1BQU0sRUFJVSxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1osT0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWixPQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFckMsUUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUN2QixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMxQixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRXJCLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxvQkFaTixNQUFNLEFBWWtCLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxNQUFNLENBQUMsQ0FBQTs7QUFFL0IsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLG9CQWZOLE1BQU0sQUFla0IsQ0FBQyxDQUFBO0FBQy9CLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLE1BQU0sQ0FBQyxDQUFBOztBQUUvQixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDNUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUU3QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEIsVUFBTSxDQUFDLEtB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Q0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQzdCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUM1QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDNUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUU1QixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDbkMsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLCtCQUErQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzlDLFFBQU0sTUFBTSxHQUFHLFlBeEVULE1BQU0sRUF3RVUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7QUFDdEMsUUFBTSxHQUFHLEdBQUcsV0FBVSxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxDQUFBO0FBQ3hDLFFBQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pCLFVBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0dBQ2xELENBQUMsQ0FBQTs7QUFFRix3QkFBSyxvQ0FBb0MsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNuRCxRQUFNLE1BQU0sR0FBRyxZQS9FVCxNQUFNLEVBK0VVLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ3RDLFFBQU0sR0FBRyxHQUFHLFdBQVUsR0FBRyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQTtBQUN4QyxRQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDckIsVUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7R0FDbEQsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLG9CQUFvQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ25DLFFBQU0sTUFBTSxHQUFHLFlBdEZULE1BQU0sRUFzRlUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQ2pDLFFBQU0sR0FBRyxHQUFHLFdBQVUsR0FBRyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQTtBQUN2QyxRQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFekIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUM1QixVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEFBQUMsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxrQ0FBa0MsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNqRCxRQUFNLEtBQUssR0FBRyxZQWhHUixNQUFNLEVBZ0dTO0FBQ25CLE9BQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1osT0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDYixFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUVYLFFBQU0sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFBOztBQUVsQixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3JCLFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTs7QUFFeEMsUUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7O0FBRXpCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN0QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckIsVUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBOztBQUV6QyxRQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUU5QixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3JCLFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtHQUMzQyxDQUFDLENBQUE7O0FBRUYsd0JBQUssd0JBQXdCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDdkMsUUFBTSxLQUFLLEdBQUcsWUE1SFIsTUFBTSxFQTRIUztBQUNuQixPQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNaLE9BQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2IsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFWCxRQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTs7QUFFekIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQTtBQUMzQixVQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7R0FDekMsQ0FBQyxDQUFBOztBQUlGLHdCQUFLLHFDQUFxQyxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3BELFFBQU0sS0FBSyxHQUFHLFlBM0lSLE1BQU0sRUEySVM7QUFDbkIsT0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWixPQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNiLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRVgsVUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2xCLFdBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNaLEVBQUUsK0JBQStCLENBQUMsQ0FBQTs7QUFFbkMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2xCLFdBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNULEVBQUUsNEJBQTRCLENBQUMsQ0FBQTs7QUFFaEMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2xCLFdBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNaLEVBQUUsK0JBQStCLENBQUMsQ0FBQTs7QUFFbkMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2xCLFdBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNoQixFQUFFLGlDQUFpQyxDQUFDLENBQUE7R0FDdEMsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLDhCQUE4QixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzdDLFFBQU0sS0FBSyxHQUFHLFlBbEtSLE1BQU0sRUFrS1M7QUFDbkIsT0FBQyxFQUFFLE1BQU07QUFDVCxPQUFDLEVBQUUsTUFBTTtLQUNWLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRVgsVUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFNO0FBQ2xCLFdBQUssRUFBRSxDQUFBO0tBQ1IsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBOztBQUVqQyxVQUFNLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDbEIsV0FBSyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUE7S0FDZCxFQUFFLDZCQUE2QixDQUFDLENBQUE7O0FBRWpDLFFBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUE7O0FBRTlCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNyQixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDdEIsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLHFCQUFxQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ3BDLFFBQU0sYUFBYSxHQUFHLFlBdExoQixNQUFNLEVBc0xpQixFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7O0FBRXBELFVBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxPQXZMakMsS0FBSyxDQXVMa0MsUUFBUSxDQUFDLEVBQUUseUNBQ0osQ0FBQTs7QUFFcEQsVUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUUsaUVBQzZCLENBQUE7O0FBRXhFLFFBQU0sV0FBVyxHQUFHLFlBOUxkLE1BQU0sRUE4TGUsRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFM0QsVUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLE9BL0wvQixLQUFLLENBK0xnQyxRQUFRLENBQUMsRUFBRSxFQUN6QyxPQUFPLENBQUMsQ0FBQTs7QUFFckIsVUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUUsa0NBQ0EsQ0FBQTs7QUFFekMsUUFBTSxhQUFhLEdBQUcsWUF0TWhCLE1BQU0sRUFzTWlCLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFMUQsVUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLE9Bdk1qQyxLQUFLLENBdU1rQyxRQUFRLENBQUMsRUFBRSwrQ0FDRSxDQUFBOztBQUUxRCxVQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsRUFBRSx1RUFDbUMsQ0FBQTs7QUFFOUUsUUFBTSxtQkFBbUIsR0FBRyxZQTlNdEIsTUFBTSxFQThNdUIsRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFekUsVUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsT0EvTXZDLEtBQUssQ0ErTXdDLFFBQVEsQ0FBQyxFQUFFLEVBQ2pELE9BQU8sQ0FBQyxDQUFBOztBQUVyQixVQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxFQUFFLGtDQUNSLENBQUE7R0FDMUMsQ0FBQyxDQUFBOztBQUdGLHdCQUFLLGdCQUFnQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQy9CLFFBQU0sS0FBSyxHQUFHLFlBek5SLE1BQU0sRUF5TlMsRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMzRCxRQUFNLElBQUksR0FBRyxZQTFOUCxNQUFNLEVBME5RLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7O0FBRXZELFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSwrRkFDc0UsQ0FBQTs7QUFFOUYsVUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsK0ZBQ3NELENBQUE7O0FBRTlGLFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSwrRkFDeUMsQ0FBQTs7QUFFOUYsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUE7O0FBRTlDLFVBQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRTFELFVBQU0sQ0FBQyxNQUFNLENBQUMsWUFBTTtBQUNsQixVQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDakMsRUFBRSwrQkFBK0IsQ0FBQyxDQUFBOztBQUVuQyxVQUFNLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDbEIsVUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsRUFBQyxDQUFDLENBQUE7S0FDckMsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FBQTs7QUFFRix3QkFBSyx1QkFBdUIsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUN0QyxRQUFNLEtBQUssR0FBRyxZQW5QUixNQUFNLEVBbVBTLEVBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxPQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTs7QUFFbkMsUUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQTtBQUN0QixRQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFMUIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3JCLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtHQUN2QixDQUFDLENBQUE7O0FBRUYsd0JBQUssMEJBQTBCLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDekMsUUFBTSxLQUFLLEdBQUcsWUE5UFIsTUFBTSxFQThQUyxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1osT0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUE7O0FBRXBDLFFBQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUE7O0FBRXJCLFVBQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO0tBQUEsRUFDZCxtQ0FBbUMsQ0FBQyxDQUFBOztBQUVqRCxRQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQzlCLE9BQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1IsT0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7S0FDVCxDQUFDLENBQUE7O0FBRUYsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0dBQ3hDLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxtQkFBbUIsRUFBRSxVQUFBLE1BQU0sRUFBSTtRQUM1QixRQUFRO2dCQUFSLFFBQVE7O2VBQVIsUUFBUTs4QkFBUixRQUFROzttQ0FBUixRQUFROzs7bUJBQVIsUUFBUTs7ZUFHUixnQkFBRztBQUNMLGlCQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ2hDOzs7YUFMRyxRQUFRO09BQVMsWUFoUmpCLE1BQU0sRUFnUmtCLEVBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxPQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLE9BQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQzs7QUFNNUMsUUFBTSxDQUFDLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQTtBQUN4QixRQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFMUIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQTNSTCxNQUFNLEFBMlJpQixDQUFDLENBQUE7QUFDOUIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksUUFBUSxDQUFDLENBQUE7QUFDaEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0FBRXpCLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxvQkEvUk4sTUFBTSxBQStSa0IsQ0FBQyxDQUFBO0FBQy9CLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLFFBQVEsQ0FBQyxDQUFBO0FBQ2pDLFVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0dBQzdCLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxvQ0FBb0MsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNuRCxRQUFNLEtBQUssR0FBRyxZQXJTUixNQUFNLEVBcVNTLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUNsRCxRQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUE7O0FBRWpDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTdCLFFBQU0sVUFBVSxHQUFHLFlBM1NiLE1BQU0sRUEyU2MsRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUV2RCxVQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQyxVQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxVQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JDLFVBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7UUFFMUIsUUFBUTtnQkFBUixRQUFROztlQUFSLFFBQVE7OEJBQVIsUUFBUTs7bUNBQVIsUUFBUTs7O21CQUFSLFFBQVE7O2VBQ0gscUJBQUc7QUFDVixpQkFBVSxJQUFJLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUU7U0FDN0I7OzthQUhHLFFBQVE7T0FBUyxLQUFLOztBQU01QixVQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRXBDLFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQzNCLEtBQUssQ0FBQyxDQUFBO0dBQ3BCLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxnQkFBZ0IsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUMvQixRQUFNLEtBQUssR0FBRyxZQWxVUixNQUFNLEVBa1VTLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUNsRCxRQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTs7QUFFeEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3BCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFckIsUUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUVwQixVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDckIsVUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0dBQ3RCLENBQUMsQ0FBQTs7QUFFRix3QkFBSyxxQ0FBcUMsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNwRCxRQUFNLEtBQUssR0FBRyxZQS9VUixNQUFNLEVBK1VTLEVBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQTtBQUM1QyxRQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUU3QixVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDcEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUVwQixVQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7S0FBQSxFQUNkLDZCQUE2QixDQUFDLENBQUE7R0FDN0MsQ0FBQyxDQUFBOztBQUVGLHdCQUFLLDJCQUEyQixFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQzFDLFFBQU0sS0FBSyxHQUFHLFlBMVZSLE1BQU0sRUEwVlM7QUFDbkIsV0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDakIsZUFBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDMUIsQ0FBQyxDQUFBOztBQUVGLFFBQU0sS0FBSyxHQUFHLFlBL1ZSLE1BQU0sRUErVlM7QUFDbkIsVUFBSSxFQUFFLEtBQUs7QUFDWCxjQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDLENBQUE7O0FBRUYsUUFBTSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUE7O0FBRWxCLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFBO0FBQ3RDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTs7QUFFMUMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUVqQyxRQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUUzQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7QUFDckMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTtBQUN0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUE7O0FBRTFDLFFBQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUM7QUFDdkIsY0FBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQztBQUMzQixXQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFBOztBQUU3QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7QUFDckMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTtBQUN0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFBO0dBQ2xDLENBQUMsQ0FBQTs7QUFHRix3QkFBSyx3QkFBd0IsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNyQyxRQUFNLEtBQUssR0FBRyxZQXZZVixNQUFNLEVBdVlXO0FBQ25CLFdBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2pCLGVBQVMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQzFCLENBQUMsQ0FBQTs7QUFFRixRQUFNLEtBQUssR0FBRyxZQTVZVixNQUFNLEVBNFlXO0FBQ25CLFVBQUksRUFBRSxLQUFLO0FBQ1gsY0FBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQyxDQUFBOztBQUVGLFFBQU0sRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFBO0FBQ2xCLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUMvQixVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFBO0FBQ3RDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTs7QUFFMUMsUUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtBQUMxQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7QUFDckMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTtBQUN0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUE7O0FBRTFDLFFBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDUixVQUFBLENBQUM7YUFBSyxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUM7S0FBQyxDQUFDLENBQUE7QUFDaEQsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsWUFBWSxLQUFLLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUE7QUFDdEMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFBOztBQUUxQyxRQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQUFBQyxDQUFDLENBQUE7QUFDaEMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsWUFBWSxLQUFLLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQy9CLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUE7QUFDdEMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUNuQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFBOztBQUUxQyxRQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFDLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUE7QUFDbkMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxZQUFZLEtBQUssQ0FBQyxDQUFBO0FBQ3ZDLFVBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUE7QUFDcEMsVUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQTtBQUN0QyxVQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVB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UyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBOztBQUUzQyxVQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBOztBQUUzQyxVQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsRUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTNDLFVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEFBQUMsRUFBQyxDQUFDLENBQUMsRUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRzNDLFVBQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksVUFBVSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDO0tBQUEsRUFDNUIsbUJBQW1CLENBQUMsQ0FBQTtBQUNsQyxVQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLFVBQVUsQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQztLQUFBLEVBQzVCLDBCQUEwQixDQUFDLENBQUE7O0FBRXpDLFFBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBOztBQUV2QyxVQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7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LEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFBOztBQUd4QixVQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtBQUNqRSxVQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtBQUMxRSxVQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUE7R0FDM0UsQ0FBQyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSBcIi4vdGVzdFwiXG5pbXBvcnQgKiBhcyBJbW11dGFibGUgZnJvbSBcImltbXV0YWJsZVwiXG5pbXBvcnQge1JlY29yZH0gZnJvbSBcIi4uL3JlY29yZFwiXG5pbXBvcnQge1R5cGVkLCB0eXBlT2YsIFVuaW9uLCBSYW5nZSwgTWF5YmV9IGZyb20gXCIuLi90eXBlZFwiXG5cbnRlc3QoXCJkZWZpbmUgYSBjb25zdHJ1Y3RvclwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBNeVR5cGUgPSBSZWNvcmQoe2E6IE51bWJlcigxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBiOiBOdW1iZXIoMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgYzogTnVtYmVyKDMpfSlcblxuICBjb25zdCB0MSA9IG5ldyBNeVR5cGUoKVxuICBjb25zdCB0MiA9IHQxLnNldChcImFcIiwgMTApXG4gIGNvbnN0IHQzID0gdDIuY2xlYXIoKVxuXG4gIGFzc2VydC5vayh0MSBpbnN0YW5jZW9mIFJlY29yZClcbiAgYXNzZXJ0Lm9rKHQxIGluc3RhbmNlb2YgTXlUeXBlKVxuXG4gIGFzc2VydC5vayh0MyBpbnN0YW5jZW9mIFJlY29yZClcbiAgYXNzZXJ0Lm9rKHQzIGluc3RhbmNlb2YgTXlUeXBlKVxuXG4gIGFzc2VydC5lcXVhbCh0MS5nZXQoXCJhXCIpLCAxKVxuICBhc3NlcnQuZXF1YWwodDIuZ2V0KFwiYVwiKSwgMTApXG5cbiAgYXNzZXJ0LmVxdWFsKHQxLnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbCh0Mi5zaXplLCAzKVxufSlcblxudGVzdChcInBhc3NlcyB0aHJvdWdoIHJlY29yZHMgb2YgdGhlIHNhbWUgdHlwZVwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBQMiA9IFJlY29yZCh7IHg6IE51bWJlcigwKSwgeTogTnVtYmVyKDApIH0pXG4gIGNvbnN0IFAzID0gUmVjb3JkKHsgeDogTnVtYmVyKDApLCB5OiBOdW1iZXIoMCksIHo6IE51bWJlcigwKSB9KVxuICBjb25zdCBwMiA9IFAyKClcbiAgY29uc3QgcDMgPSBQMygpXG4gIGFzc2VydC5vayhQMyhwMikgaW5zdGFuY2VvZiBQMylcbiAgYXNzZXJ0Lm9rKFAyKHAzKSBpbnN0YW5jZW9mIFAyKVxuICBhc3NlcnQuZXF1YWwoUDIocDIpLCBwMilcbiAgYXNzZXJ0LmVxdWFsKFAzKHAzKSwgcDMpXG59KVxuXG50ZXN0KFwib25seSBhbGxvd3Mgc2V0dGluZyB3aGF0IGl0IGtub3dzIGFib3V0XCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IE15VHlwZSA9IFJlY29yZCh7YTogTnVtYmVyKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGI6IE51bWJlcigyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBjOiBOdW1iZXIoMyl9KVxuXG4gIGNvbnN0IHQxID0gbmV3IE15VHlwZSh7YTogMTAsIGI6MjB9KVxuICBhc3NlcnQudGhyb3dzKF8gPT4gdDEuc2V0KFwiZFwiLCA0KSxcbiAgICAgICAgICAgICAgICAvQ2Fubm90IHNldCB1bmtub3duIGZpZWxkIFwiZFwiLylcbn0pXG5cbnRlc3QoXCJoYXMgYSBmaXhlZCBzaXplIGFuZCBmYWxscyBiYWNrIHRvIGRlZmF1bHQgdmFsdWVzXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IE15VHlwZSA9IFJlY29yZCh7YTogTnVtYmVyKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGI6IE51bWJlcigyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBjOiBOdW1iZXIoMyl9KVxuXG4gIGNvbnN0IHQxID0gbmV3IE15VHlwZSh7YTogMTAsIGI6MjB9KVxuICBjb25zdCB0MiA9IG5ldyBNeVR5cGUoe2I6IDIwfSlcbiAgY29uc3QgdDMgPSB0MS5yZW1vdmUoXCJhXCIpXG4gIGNvbnN0IHQ0ID0gdDMuY2xlYXIoKVxuXG4gIGFzc2VydC5lcXVhbCh0MS5zaXplLCAzKVxuICBhc3NlcnQuZXF1YWwodDIuc2l6ZSwgMylcbiAgYXNzZXJ0LmVxdWFsKHQzLnNpemUsIDMpXG4gIGFzc2VydC5lcXVhbCh0NC5zaXplLCAzKVxuXG4gIGFzc2VydC5lcXVhbCh0MS5nZXQoXCJhXCIpLCAxMClcbiAgYXNzZXJ0LmVxdWFsKHQyLmdldChcImFcIiksIDEpXG4gIGFzc2VydC5lcXVhbCh0My5nZXQoXCJhXCIpLCAxKVxuICBhc3NlcnQuZXF1YWwodDQuZ2V0KFwiYlwiKSwgMilcblxuICBhc3NlcnQub2sodDIuZXF1YWxzKHQzKSlcbiAgYXNzZXJ0Lm5vdE9rKHQyLmVxdWFscyh0NCkpXG4gIGFzc2VydC5vayh0NC5lcXVhbHMobmV3IE15VHlwZSgpKSlcbn0pXG5cbnRlc3QoXCJjb252ZXJ0cyBzZXF1ZW5jZXMgdG8gcmVjb3Jkc1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBNeVR5cGUgPSBSZWNvcmQoe2E6MSwgYjoyLCBjOjN9KVxuICBjb25zdCBzZXEgPSBJbW11dGFibGUuU2VxKHthOiAxMCwgYjoyMH0pXG4gIGNvbnN0IHQgPSBuZXcgTXlUeXBlKHNlcSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh0LnRvT2JqZWN0KCksIHthOjEwLCBiOjIwLCBjOjN9KVxufSlcblxudGVzdChcImFsbG93cyBmb3IgZnVuY3Rpb25hbCBjb25zdHJ1Y3Rpb25cIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgTXlUeXBlID0gUmVjb3JkKHthOjEsIGI6MiwgYzozfSlcbiAgY29uc3Qgc2VxID0gSW1tdXRhYmxlLlNlcSh7YTogMTAsIGI6MjB9KVxuICBjb25zdCB0ID0gTXlUeXBlKHNlcSlcbiAgYXNzZXJ0LmRlZXBFcXVhbCh0LnRvT2JqZWN0KCksIHthOjEwLCBiOjIwLCBjOjN9KVxufSlcblxudGVzdChcInNraXBzIHVua25vd24ga2V5c1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBNeVR5cGUgPSBSZWNvcmQoe2E6MSwgYjoyfSlcbiAgY29uc3Qgc2VxID0gSW1tdXRhYmxlLlNlcSh7YjoyMCwgYzozMH0pXG4gIGNvbnN0IHQgPSBuZXcgTXlUeXBlKHNlcSlcblxuICBhc3NlcnQuZXF1YWwodC5nZXQoXCJhXCIpLCAxKVxuICBhc3NlcnQuZXF1YWwodC5nZXQoXCJiXCIpLCAyMClcbiAgYXNzZXJ0LmVxdWFsKHQuZ2V0KFwiY1wiKSwgdm9pZCgwKSlcbn0pXG5cbnRlc3QoXCJmbGF0IHJlY29yZCB3aXRoIGRlZmF1bHRzIHZhbHVlc1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBQb2ludCA9IFJlY29yZCh7XG4gICAgeDogTnVtYmVyKDApLFxuICAgIHk6IE51bWJlcigwKVxuICB9LCBcIlBvaW50XCIpXG5cbiAgY29uc3QgcDEgPSBQb2ludCgpXG5cbiAgYXNzZXJ0LmVxdWFsKHAxLngsIDApXG4gIGFzc2VydC5lcXVhbChwMS55LCAwKVxuICBhc3NlcnQuZXF1YWwoSlNPTi5zdHJpbmdpZnkocDEpLFxuICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3g6MCwgeTowfSkpXG5cbiAgY29uc3QgcDIgPSBQb2ludCh7eDogMTB9KVxuXG4gIGFzc2VydC5lcXVhbChwMi54LCAxMClcbiAgYXNzZXJ0LmVxdWFsKHAyLnksIDApXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShwMiksXG4gICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7eDoxMCwgeTowfSkpXG5cbiAgY29uc3QgcDMgPSBQb2ludCh7eDogMSwgeTogMn0pXG5cbiAgYXNzZXJ0LmVxdWFsKHAzLngsIDEpXG4gIGFzc2VydC5lcXVhbChwMy55LCAyKVxuICBhc3NlcnQuZXF1YWwoSlNPTi5zdHJpbmdpZnkocDMpLFxuICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3g6IDEsIHk6IDJ9KSlcbn0pXG5cbnRlc3QoXCJpZ25vcmVzIHVua25vd24gZmllbGRzXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IFBvaW50ID0gUmVjb3JkKHtcbiAgICB4OiBOdW1iZXIoMCksXG4gICAgeTogTnVtYmVyKDApXG4gIH0sIFwiUG9pbnRcIilcblxuICBjb25zdCBwMSA9IFBvaW50KHt6OiAyMH0pXG5cbiAgYXNzZXJ0LmVxdWFsKHAxLnosIHZvaWQoMCkpXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShwMSksXG4gICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7eDowLCB5OjB9KSlcbn0pXG5cblxuXG50ZXN0KFwiaW52YWxpZCBhcmd1bWVudCBwYXNzZWQgdG8gYSByZWNvcmRcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe1xuICAgIHg6IE51bWJlcigwKSxcbiAgICB5OiBOdW1iZXIoMClcbiAgfSwgXCJQb2ludFwiKVxuXG4gIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgIFBvaW50KG51bGwpXG4gIH0sIC9JbnZhbGlkIGRhdGEgc3RydWN0dXJlIFwibnVsbFwiLylcblxuICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICBQb2ludCg3KVxuICB9LCAvSW52YWxpZCBkYXRhIHN0cnVjdHVyZSBcIjdcIi8pXG5cbiAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgUG9pbnQodHJ1ZSlcbiAgfSwgL0ludmFsaWQgZGF0YSBzdHJ1Y3R1cmUgXCJ0cnVlXCIvKVxuXG4gIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgIFBvaW50KFwie3g6IDF9XCIpXG4gIH0sIC9JbnZhbGlkIGRhdGEgc3RydWN0dXJlIFwie3g6IDF9XCIvKVxufSlcblxudGVzdChcImZsYXQgcmVjb3JkIHdpdGhvdXQgZGVmYXVsdHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe1xuICAgIHg6IE51bWJlcixcbiAgICB5OiBOdW1iZXJcbiAgfSwgXCJQb2ludFwiKVxuXG4gIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgIFBvaW50KClcbiAgfSwgL0ludmFsaWQgdmFsdWUgZm9yIFwieFwiIGZpZWxkLylcblxuICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICBQb2ludCh7eDogMX0pXG4gIH0sIC9JbnZhbGlkIHZhbHVlIGZvciBcInlcIiBmaWVsZC8pXG5cbiAgY29uc3QgcDEgPSBQb2ludCh7eDogMCwgeTogMX0pXG5cbiAgYXNzZXJ0LmVxdWFsKHAxLngsIDApXG4gIGFzc2VydC5lcXVhbChwMS55LCAxKVxufSlcblxudGVzdChcInN0cmluZ2lmeSBvbiByZWNvcmRcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgVW5sYWJsZWRQb2ludCA9IFJlY29yZCh7eDogTnVtYmVyLCB5OiBOdW1iZXJ9KVxuXG4gIGFzc2VydC5lcXVhbChVbmxhYmxlZFBvaW50KHt4OjAsIHk6MH0pW1R5cGVkLnR5cGVOYW1lXSgpLFxuICAgICAgICAgICAgICAgYFR5cGVkLlJlY29yZCh7eDogTnVtYmVyLCB5OiBOdW1iZXJ9KWApXG5cbiAgYXNzZXJ0LmVxdWFsKFVubGFibGVkUG9pbnQoe3g6NCwgeTo5fSkgKyBcIlwiLFxuICAgICAgICAgICAgICAgYFR5cGVkLlJlY29yZCh7eDogTnVtYmVyLCB5OiBOdW1iZXJ9KSh7IFwieFwiOiA0LCBcInlcIjogOSB9KWApXG5cbiAgY29uc3QgTGFibGVkUG9pbnQgPSBSZWNvcmQoe3g6IE51bWJlciwgeTogTnVtYmVyfSwgXCJQb2ludFwiKVxuXG4gIGFzc2VydC5lcXVhbChMYWJsZWRQb2ludCh7eDowLCB5OjB9KVtUeXBlZC50eXBlTmFtZV0oKSxcbiAgICAgICAgICAgICAgIFwiUG9pbnRcIilcblxuICBhc3NlcnQuZXF1YWwoTGFibGVkUG9pbnQoe3g6NCwgeTo5fSkgKyBcIlwiLFxuICAgICAgICAgICAgICAgYFBvaW50KHsgXCJ4XCI6IDQsIFwieVwiOiA5IH0pYClcblxuICBjb25zdCBQb2ludERlZmF1bHRzID0gUmVjb3JkKHt4OiBOdW1iZXIoMCksIHk6IE51bWJlcig3KX0pXG5cbiAgYXNzZXJ0LmVxdWFsKFBvaW50RGVmYXVsdHMoe3g6NSwgeTozfSlbVHlwZWQudHlwZU5hbWVdKCksXG4gICAgICAgICAgICAgICBgVHlwZWQuUmVjb3JkKHt4OiBOdW1iZXIoMCksIHk6IE51bWJlcig3KX0pYClcblxuICBhc3NlcnQuZXF1YWwoUG9pbnREZWZhdWx0cyh7eDo0LCB5Ojl9KSArIFwiXCIsXG4gICAgICAgICAgICAgICBgVHlwZWQuUmVjb3JkKHt4OiBOdW1iZXIoMCksIHk6IE51bWJlcig3KX0pKHsgXCJ4XCI6IDQsIFwieVwiOiA5IH0pYClcblxuICBjb25zdCBMYWJsZWRQb2ludERlZmF1bHRzID0gUmVjb3JkKHt4OiBOdW1iZXIoNSksIHk6IE51bWJlcig5KX0sIFwiUG9pbnRcIilcblxuICBhc3NlcnQuZXF1YWwoTGFibGVkUG9pbnREZWZhdWx0cyh7eDowLCB5OjB9KVtUeXBlZC50eXBlTmFtZV0oKSxcbiAgICAgICAgICAgICAgIFwiUG9pbnRcIilcblxuICBhc3NlcnQuZXF1YWwoTGFibGVkUG9pbnREZWZhdWx0cyh7eDo0LCB5Ojl9KSArIFwiXCIsXG4gICAgICAgICAgICAgICBgUG9pbnQoeyBcInhcIjogNCwgXCJ5XCI6IDkgfSlgKVxufSlcblxuXG50ZXN0KFwibmVzdGVkIHJlY29yZHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe3g6IE51bWJlcigwKSwgeTogTnVtYmVyKDApfSwgXCJQb2ludFwiKVxuICBjb25zdCBMaW5lID0gUmVjb3JkKHtiZWdpbjogUG9pbnQsIGVuZDogUG9pbnR9LCBcIkxpbmVcIilcblxuICBhc3NlcnQuZXF1YWwoTGluZSgpICsgXCJcIixcbiAgICAgICAgICAgICAgIGBMaW5lKHsgXCJiZWdpblwiOiBQb2ludCh7IFwieFwiOiAwLCBcInlcIjogMCB9KSwgXCJlbmRcIjogUG9pbnQoeyBcInhcIjogMCwgXCJ5XCI6IDAgfSkgfSlgKVxuXG4gIGFzc2VydC5lcXVhbChMaW5lKHtiZWdpbjoge3g6IDV9IH0pICsgXCJcIixcbiAgICAgICAgICAgICAgIGBMaW5lKHsgXCJiZWdpblwiOiBQb2ludCh7IFwieFwiOiA1LCBcInlcIjogMCB9KSwgXCJlbmRcIjogUG9pbnQoeyBcInhcIjogMCwgXCJ5XCI6IDAgfSkgfSlgKVxuXG4gIGFzc2VydC5lcXVhbChMaW5lKHtiZWdpbjoge3g6IDV9LCBlbmQ6IHt5OiA3fSB9KSArIFwiXCIsXG4gICAgICAgICAgICAgICBgTGluZSh7IFwiYmVnaW5cIjogUG9pbnQoeyBcInhcIjogNSwgXCJ5XCI6IDAgfSksIFwiZW5kXCI6IFBvaW50KHsgXCJ4XCI6IDAsIFwieVwiOiA3IH0pIH0pYClcblxuICBjb25zdCBsMSA9IExpbmUoe2JlZ2luOiB7eDogNX0sIGVuZDoge3k6IDd9IH0pXG5cbiAgYXNzZXJ0Lm9rKExpbmUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShsMSkpKS5lcXVhbHMobDEpKVxuXG4gIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgIExpbmUoe2JlZ2luOiB7eDogNX0sIGVuZDogbnVsbH0pXG4gIH0sIC9JbnZhbGlkIHZhbHVlIGZvciBcImVuZFwiIGZpZWxkLylcblxuICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICBMaW5lKHtiZWdpbjoge3g6IDV9LCBlbmQ6IHt5OiBcIjdcIn19KVxuICB9LCAvSW52YWxpZCB2YWx1ZSBmb3IgXCJ5XCIgZmllbGQvKVxufSlcblxudGVzdChcImRlZmluZXMgYSBjb25zdHJ1Y3RvclwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBQb2ludCA9IFJlY29yZCh7eDpOdW1iZXIoMCksXG4gICAgICAgICAgICAgICAgICAgICAgICB5Ok51bWJlcigwKX0pXG5cbiAgY29uc3QgcDEgPSBuZXcgUG9pbnQoKVxuICBjb25zdCBwMiA9IHAxLnNldChcInhcIiwgMTApXG5cbiAgYXNzZXJ0LmVxdWFsKHAxLngsIDApXG4gIGFzc2VydC5lcXVhbChwMi54LCAxMClcbn0pXG5cbnRlc3QoXCJjYW4gaGF2ZSBtdXRhdGlvbnMgYXBwbHlcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe3g6IE51bWJlcigwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE51bWJlcigwKX0pXG5cbiAgY29uc3QgcCA9IG5ldyBQb2ludCgpXG5cbiAgYXNzZXJ0LnRocm93cyhfID0+IHAueCA9IDEwLFxuICAgICAgICAgICAgICAgL0Nhbm5vdCBzZXQgb24gYW4gaW1tdXRhYmxlIHJlY29yZC8pXG5cbiAgY29uc3QgcDIgPSBwLndpdGhNdXRhdGlvbnMobSA9PiB7XG4gICAgbS54ID0gMTBcbiAgICBtLnkgPSAyMFxuICB9KVxuXG4gIGFzc2VydC5lcXVhbChwMi54LCAxMCwgXCJ4IHdhcyB1cGRhdGVkXCIpXG4gIGFzc2VydC5lcXVhbChwMi55LCAyMCwgXCJ5IHdhcyB1cGRhdGVkXCIpXG59KVxuXG50ZXN0KFwiY2FuIGJlIHN1YmNsYXNzZWRcIiwgYXNzZXJ0ID0+IHtcbiAgY2xhc3MgQWxwaGFiZXQgZXh0ZW5kcyBSZWNvcmQoe2E6TnVtYmVyKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYjpOdW1iZXIoMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjOk51bWJlcigzKX0pIHtcbiAgICBzb3VwKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYSArIHRoaXMuYiArIHRoaXMuY1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHQgPSBuZXcgQWxwaGFiZXQoKVxuICBjb25zdCB0MiA9IHQuc2V0KFwiYlwiLCAyMDApXG5cbiAgYXNzZXJ0Lm9rKHQgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh0IGluc3RhbmNlb2YgQWxwaGFiZXQpXG4gIGFzc2VydC5lcXVhbCh0LnNvdXAoKSwgNilcblxuICBhc3NlcnQub2sodDIgaW5zdGFuY2VvZiBSZWNvcmQpXG4gIGFzc2VydC5vayh0MiBpbnN0YW5jZW9mIEFscGhhYmV0KVxuICBhc3NlcnQuZXF1YWwodDIuc291cCgpLCAyMDQpXG59KVxuXG50ZXN0KFwic2hvcnQtY2lyY3VpdHMgaWYgYWxyZWFkeSBhIHJlY29yZFwiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBQb2ludCA9IFJlY29yZCh7eDogTnVtYmVyKDApLCB5OiBOdW1iZXIoMCl9KVxuICBjb25zdCBwID0gbmV3IFBvaW50KHt4OiAxLCB5OiAyfSlcblxuICBhc3NlcnQuZXF1YWwocCwgUG9pbnQocCkpXG4gIGFzc2VydC5lcXVhbChwLCBuZXcgUG9pbnQocCkpXG5cbiAgY29uc3QgT3RoZXJQb2ludCA9IFJlY29yZCh7eDogTnVtYmVyKDApLCB5OiBOdW1iZXIoMCl9KVxuXG4gIGFzc2VydC5ub3RFcXVhbChwLCBPdGhlclBvaW50KHApKVxuICBhc3NlcnQub2socC5lcXVhbHMoT3RoZXJQb2ludChwKSkpXG4gIGFzc2VydC5ub3RFcXVhbChwLCBuZXcgT3RoZXJQb2ludChwKSlcbiAgYXNzZXJ0Lm9rKHAuZXF1YWxzKG5ldyBPdGhlclBvaW50KHApKSlcbiAgYXNzZXJ0LmVxdWFsKE90aGVyUG9pbnQocCkueCwgMSlcbiAgYXNzZXJ0LmVxdWFsKE90aGVyUG9pbnQocCkueSwgMilcblxuICBjbGFzcyBTdWJQb2ludCBleHRlbmRzIFBvaW50IHtcbiAgICBzdHJpbmdpZnkoKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy54fToke3RoaXMueX1gXG4gICAgfVxuICB9XG5cbiAgYXNzZXJ0Lm5vdEVxdWFsKHAsIG5ldyBTdWJQb2ludChwKSlcbiAgYXNzZXJ0Lm9rKHAuZXF1YWxzKG5ldyBTdWJQb2ludChwKSkpXG5cbiAgYXNzZXJ0LmVxdWFsKG5ldyBTdWJQb2ludChwKS5zdHJpbmdpZnkoKSxcbiAgICAgICAgICAgICAgIFwiMToyXCIpXG59KVxuXG50ZXN0KFwiY2FuIGJlIGNsZWFyZWRcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe3g6IE51bWJlcigxKSwgeTogTnVtYmVyKDIpfSlcbiAgY29uc3QgcCA9IFBvaW50KHt5OiAyMH0pXG5cbiAgYXNzZXJ0LmVxdWFsKHAueCwgMSlcbiAgYXNzZXJ0LmVxdWFsKHAueSwgMjApXG5cbiAgY29uc3QgcGMgPSBwLmNsZWFyKClcblxuICBhc3NlcnQuZXF1YWwocGMueCwgMSlcbiAgYXNzZXJ0LmVxdWFsKHBjLnksIDIpXG59KVxuXG50ZXN0KFwiY2FuIG5vdCBiZSBjbGVhcmVkIHdoZW4gbm8gZGVmYXVsdHNcIiwgYXNzZXJ0ID0+IHtcbiAgY29uc3QgUG9pbnQgPSBSZWNvcmQoe3g6IE51bWJlciwgeTogTnVtYmVyfSlcbiAgY29uc3QgcCA9IFBvaW50KHt4OiAxLCB5OiAxfSlcblxuICBhc3NlcnQuZXF1YWwocC54LCAxKVxuICBhc3NlcnQuZXF1YWwocC55LCAxKVxuXG4gIGFzc2VydC50aHJvd3MoXyA9PiBwLmNsZWFyKCksXG4gICAgICAgICAgICAgICAgL0ludmFsaWQgdmFsdWUgZm9yIFwieFwiIGZpZWxkLylcbn0pXG5cbnRlc3QoXCJjYW4gY29uc3RydWN0IHN1Yi1yZWNvcmRzXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IEZpZWxkID0gUmVjb3JkKHtcbiAgICB2YWx1ZTogU3RyaW5nKFwiXCIpLFxuICAgIGlzRm9jdXNlZDogQm9vbGVhbihmYWxzZSlcbiAgfSlcblxuICBjb25zdCBMb2dpbiA9IFJlY29yZCh7XG4gICAgdXNlcjogRmllbGQsXG4gICAgcGFzc3dvcmQ6IEZpZWxkXG4gIH0pXG5cbiAgY29uc3QgbDEgPSBMb2dpbigpXG5cbiAgYXNzZXJ0Lm9rKGwxLnVzZXIgaW5zdGFuY2VvZiBGaWVsZClcbiAgYXNzZXJ0Lm9rKGwxLnBhc3N3b3JkIGluc3RhbmNlb2YgRmllbGQpXG4gIGFzc2VydC5vayhsMS51c2VyLnZhbHVlID09PSBcIlwiKVxuICBhc3NlcnQub2sobDEudXNlci5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuICBhc3NlcnQub2sobDEucGFzc3dvcmQudmFsdWUgPT09IFwiXCIpXG4gIGFzc2VydC5vayhsMS5wYXNzd29yZC5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuXG4gIGFzc2VydC5vayhsMS5lcXVhbHMobmV3IExvZ2luKCkpKVxuXG4gIGNvbnN0IGwyID0gTG9naW4oe3VzZXI6IHt2YWx1ZTogXCJnb3phbGFcIn19KVxuXG4gIGFzc2VydC5vayhsMi51c2VyIGluc3RhbmNlb2YgRmllbGQpXG4gIGFzc2VydC5vayhsMi5wYXNzd29yZCBpbnN0YW5jZW9mIEZpZWxkKVxuICBhc3NlcnQub2sobDIudXNlci52YWx1ZSA9PT0gXCJnb3phbGFcIilcbiAgYXNzZXJ0Lm9rKGwyLnVzZXIuaXNGb2N1c2VkID09PSBmYWxzZSlcbiAgYXNzZXJ0Lm9rKGwyLnBhc3N3b3JkLnZhbHVlID09PSBcIlwiKVxuICBhc3NlcnQub2sobDIucGFzc3dvcmQuaXNGb2N1c2VkID09PSBmYWxzZSlcblxuICBjb25zdCBsMyA9IExvZ2luKHt1c2VyOiB7dmFsdWU6IFwiZ296YWxhXCJ9LFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDoge2lzRm9jdXNlZDogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhOiB7aXNGb2N1c2VkOiBmYWxzZX19KVxuXG4gIGFzc2VydC5vayhsMy51c2VyIGluc3RhbmNlb2YgRmllbGQpXG4gIGFzc2VydC5vayhsMy5wYXNzd29yZCBpbnN0YW5jZW9mIEZpZWxkKVxuICBhc3NlcnQub2sobDMudXNlci52YWx1ZSA9PT0gXCJnb3phbGFcIilcbiAgYXNzZXJ0Lm9rKGwzLnVzZXIuaXNGb2N1c2VkID09PSBmYWxzZSlcbiAgYXNzZXJ0Lm9rKGwzLnBhc3N3b3JkLnZhbHVlID09PSBcIlwiKVxuICBhc3NlcnQub2sobDMucGFzc3dvcmQuaXNGb2N1c2VkID09PSB0cnVlKVxuICBhc3NlcnQub2sobDIuZXh0cmEgPT09IHVuZGVmaW5lZClcbn0pXG5cblxudGVzdChcImNhbiB1cGRhdGUgc3ViLXJlY29yZHNcIiwgYXNzZXJ0ID0+IHtcbiAgICBjb25zdCBGaWVsZCA9IFJlY29yZCh7XG4gICAgICB2YWx1ZTogU3RyaW5nKFwiXCIpLFxuICAgICAgaXNGb2N1c2VkOiBCb29sZWFuKGZhbHNlKVxuICAgIH0pXG5cbiAgICBjb25zdCBMb2dpbiA9IFJlY29yZCh7XG4gICAgICB1c2VyOiBGaWVsZCxcbiAgICAgIHBhc3N3b3JkOiBGaWVsZCxcbiAgICB9KVxuXG4gICAgY29uc3QgbDEgPSBMb2dpbigpXG4gICAgYXNzZXJ0Lm9rKGwxLnVzZXIgaW5zdGFuY2VvZiBGaWVsZClcbiAgICBhc3NlcnQub2sobDEucGFzc3dvcmQgaW5zdGFuY2VvZiBGaWVsZClcbiAgICBhc3NlcnQub2sobDEudXNlci52YWx1ZSA9PT0gXCJcIilcbiAgICBhc3NlcnQub2sobDEudXNlci5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuICAgIGFzc2VydC5vayhsMS5wYXNzd29yZC52YWx1ZSA9PT0gXCJcIilcbiAgICBhc3NlcnQub2sobDEucGFzc3dvcmQuaXNGb2N1c2VkID09PSBmYWxzZSlcblxuICAgIHZhciBsMiA9IGwxLnNldChcInVzZXJcIiwge3ZhbHVlOiBcImdvemFsYVwifSlcbiAgICBhc3NlcnQub2sobDIudXNlciBpbnN0YW5jZW9mIEZpZWxkKVxuICAgIGFzc2VydC5vayhsMi5wYXNzd29yZCBpbnN0YW5jZW9mIEZpZWxkKVxuICAgIGFzc2VydC5vayhsMi51c2VyLnZhbHVlID09PSBcImdvemFsYVwiKVxuICAgIGFzc2VydC5vayhsMi51c2VyLmlzRm9jdXNlZCA9PT0gZmFsc2UpXG4gICAgYXNzZXJ0Lm9rKGwyLnBhc3N3b3JkLnZhbHVlID09PSBcIlwiKVxuICAgIGFzc2VydC5vayhsMi5wYXNzd29yZC5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuXG4gICAgdmFyIGwzID0gbDEudXBkYXRlSW4oW1widXNlclwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBfID0+ICh7dmFsdWU6IFwidXBkYXRlSW5cIn0pKVxuICAgIGFzc2VydC5vayhsMy51c2VyIGluc3RhbmNlb2YgRmllbGQpXG4gICAgYXNzZXJ0Lm9rKGwzLnBhc3N3b3JkIGluc3RhbmNlb2YgRmllbGQpXG4gICAgYXNzZXJ0Lm9rKGwzLnVzZXIudmFsdWUgPT09IFwidXBkYXRlSW5cIilcbiAgICBhc3NlcnQub2sobDMudXNlci5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuICAgIGFzc2VydC5vayhsMy5wYXNzd29yZC52YWx1ZSA9PT0gXCJcIilcbiAgICBhc3NlcnQub2sobDMucGFzc3dvcmQuaXNGb2N1c2VkID09PSBmYWxzZSlcblxuICAgIHZhciBsNCA9IGwyLnNldChcInVzZXJcIiwgdm9pZCgwKSlcbiAgICBhc3NlcnQub2sobDQudXNlciBpbnN0YW5jZW9mIEZpZWxkKVxuICAgIGFzc2VydC5vayhsNC5wYXNzd29yZCBpbnN0YW5jZW9mIEZpZWxkKVxuICAgIGFzc2VydC5vayhsNC51c2VyLnZhbHVlID09PSBcIlwiKVxuICAgIGFzc2VydC5vayhsNC51c2VyLmlzRm9jdXNlZCA9PT0gZmFsc2UpXG4gICAgYXNzZXJ0Lm9rKGw0LnBhc3N3b3JkLnZhbHVlID09PSBcIlwiKVxuICAgIGFzc2VydC5vayhsNC5wYXNzd29yZC5pc0ZvY3VzZWQgPT09IGZhbHNlKVxuXG4gICAgdmFyIGw1ID0gbDEubWVyZ2Uoe3VzZXI6IHt2YWx1ZTogXCJtZXJnZVwifX0pXG4gICAgYXNzZXJ0Lm9rKGw1LnVzZXIgaW5zdGFuY2VvZiBGaWVsZClcbiAgICBhc3NlcnQub2sobDUucGFzc3dvcmQgaW5zdGFuY2VvZiBGaWVsZClcbiAgICBhc3NlcnQub2sobDUudXNlci52YWx1ZSA9PT0gXCJtZXJnZVwiKVxuICAgIGFzc2VydC5vayhsNS51c2VyLmlzRm9jdXNlZCA9PT0gZmFsc2UpXG4gICAgYXNzZXJ0Lm9rKGw1LnBhc3N3b3JkLnZhbHVlID09PSBcIlwiKVxuICAgIGFzc2VydC5vayhsNS5wYXNzd29yZC5pc0ZvY3VzZWQgPT09IGZhbHNlKVxufSlcblxuXG50ZXN0KFwiY2FuIHVzZSBpbnN0YW5jZXMgYXMgZmllbGRzXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IEZpZWxkID0gUmVjb3JkKHtpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiXCJ9KVxuXG4gIGNvbnN0IExvZ2luID0gUmVjb3JkKHt1c2VyOiBGaWVsZCh7aXNGb2N1c2VkOiB0cnVlfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogRmllbGR9KVxuXG4gIGNvbnN0IGwxID0gTG9naW4oKVxuXG4gIGFzc2VydC5vayhsMS51c2VyIGluc3RhbmNlb2YgRmllbGQsXG4gICAgICAgICAgICAnbDEudXNlciBpcyBGaWVsZCBpbnN0YW5jZScpXG4gIGFzc2VydC5vayhsMS5wYXNzd29yZCBpbnN0YW5jZW9mIEZpZWxkLFxuICAgICAgICAgICAgJ2wxLnBhc3N3b3JkIGlzIEZpZWxkIGluc3RhbmNlJylcbiAgYXNzZXJ0Lm9rKGwxLnVzZXIudmFsdWUgPT09IFwiXCIsXG4gICAgICAgICAgICAnbDEudXNlci52YWx1ZSBpcyBcIlwiJylcbiAgYXNzZXJ0Lm9rKGwxLnVzZXIuaXNGb2N1c2VkID09PSB0cnVlLFxuICAgICAgICAgICAgJ2wxLnVzZXIuaXNGb2N1c2VkIGlzIHRydWUnKVxuICBhc3NlcnQub2sobDEucGFzc3dvcmQudmFsdWUgPT09IFwiXCIsXG4gICAgICAgICAgICAnbDEucGFzc3dvcmQudmFsdWUgaXMgXCJcIicpXG4gIGFzc2VydC5vayhsMS5wYXNzd29yZC5pc0ZvY3VzZWQgPT09IGZhbHNlLFxuICAgICAgICAgICAgJ2wxLnBhc3N3b3JkLmlzRm9jdXNlZCBpcyBmYWxzZScpXG5cbiAgY29uc3QgbDIgPSBMb2dpbih7dXNlcjoge2lzRm9jdXNlZDogZmFsc2UsIHZhbHVlOiBcImdvemFsYVwifSxcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHtpc0ZvY3VzZWQ6IHRydWV9fSlcblxuICBhc3NlcnQub2sobDIudXNlciBpbnN0YW5jZW9mIEZpZWxkKVxuICBhc3NlcnQub2sobDIucGFzc3dvcmQgaW5zdGFuY2VvZiBGaWVsZClcbiAgYXNzZXJ0Lm9rKGwyLnVzZXIudmFsdWUgPT09IFwiZ296YWxhXCIpXG4gIGFzc2VydC5vayhsMi51c2VyLmlzRm9jdXNlZCA9PT0gZmFsc2UpXG4gIGFzc2VydC5vayhsMi5wYXNzd29yZC52YWx1ZSA9PT0gXCJcIilcbiAgYXNzZXJ0Lm9rKGwyLnBhc3N3b3JkLmlzRm9jdXNlZCA9PT0gdHJ1ZSlcbn0pXG5cbnRlc3QoXCJNYXliZSB0eXBlXCIsIGFzc2VydCA9PiB7XG4gIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgIE1heWJlKHt9KVxuICB9LCAvaXMgbm90IGEgdmFsaWQvKVxuXG4gIGNvbnN0IElucHV0TW9kZWwgPSBSZWNvcmQoe1xuICAgIHZhbHVlOiBNYXliZShTdHJpbmcpXG4gIH0sIFwiSW5wdXRNb2RlbFwiKVxuXG4gIGFzc2VydC5lcXVhbChJbnB1dE1vZGVsKCkgKyBcIlwiLFxuICAgICAgICAgICAgICAgYElucHV0TW9kZWwoeyBcInZhbHVlXCI6IG51bGwgfSlgKVxuXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShJbnB1dE1vZGVsKCkpLFxuICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3ZhbHVlOiBudWxsfSkpXG5cbiAgYXNzZXJ0LmVxdWFsKEpTT04uc3RyaW5naWZ5KElucHV0TW9kZWwoe30pKSxcbiAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHt2YWx1ZTogbnVsbH0pKVxuXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShJbnB1dE1vZGVsKHt2YWx1ZTogbnVsbH0pKSxcbiAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHt2YWx1ZTogbnVsbH0pKVxuXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShJbnB1dE1vZGVsKHt2YWx1ZTogdm9pZCgwKX0pKSxcbiAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHt2YWx1ZTogbnVsbH0pKVxuXG5cbiAgYXNzZXJ0LnRocm93cyhfID0+IElucHV0TW9kZWwoe3ZhbHVlOiAxN30pLFxuICAgICAgICAgICAgICAgIC9cIjE3XCIgaXMgbm90IG51bGx5LylcbiAgYXNzZXJ0LnRocm93cyhfID0+IElucHV0TW9kZWwoe3ZhbHVlOiAxN30pLFxuICAgICAgICAgICAgICAgIC9ub3IgaXQgaXMgb2YgU3RyaW5nIHR5cGUvKVxuXG4gIGNvbnN0IGkxID0gSW5wdXRNb2RlbCh7dmFsdWU6IFwiaGVsbG9cIn0pXG5cbiAgYXNzZXJ0LmVxdWFsKGkxLnZhbHVlLCBcImhlbGxvXCIpXG4gIGFzc2VydC5lcXVhbChKU09OLnN0cmluZ2lmeShpMSksXG4gICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7dmFsdWU6IFwiaGVsbG9cIn0pKVxuICBhc3NlcnQuZXF1YWwoaTEgKyBcIlwiLFxuICAgICAgICAgICAgICAgYElucHV0TW9kZWwoeyBcInZhbHVlXCI6IFwiaGVsbG9cIiB9KWApXG59KVxuXG5cbnRlc3QoXCJSYW5nZSB0eXBlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IENvbG9yID0gUmVjb3JkKHtcbiAgICByZWQ6IFR5cGVkLk51bWJlci5SYW5nZSgwLCAyNTUsIDApLFxuICAgIGdyZWVuOiBUeXBlZC5OdW1iZXIuUmFuZ2UoMCwgMjU1LCAwKSxcbiAgICBibHVlOiBUeXBlZC5OdW1iZXIuUmFuZ2UoMCwgMjU1LCAwKSxcbiAgICBhbHBoYTogTWF5YmUoVHlwZWQuTnVtYmVyLlJhbmdlKDAsIDEwMCkpXG4gIH0sIFwiQ29sb3JcIilcblxuICBhc3NlcnQuZXF1YWwoQ29sb3IoKSArIFwiXCIsXG4gICAgICAgICAgICAgICBgQ29sb3IoeyBcInJlZFwiOiAwLCBcImdyZWVuXCI6IDAsIFwiYmx1ZVwiOiAwLCBcImFscGhhXCI6IG51bGwgfSlgKVxuXG4gIGFzc2VydC50aHJvd3MoXyA9PiBDb2xvcih7YWxwaGE6IC0xMH0pLFxuICAgICAgICAgICAgICAgIC9cIi0xMFwiIGlzIG5vdCBudWxseS8pXG4gIGFzc2VydC50aHJvd3MoXyA9PiBDb2xvcih7YWxwaGE6IC0xMH0pLFxuICAgICAgICAgICAgICAgIC9vZiBUeXBlZC5OdW1iZXIuUmFuZ2VcXCgwXFwuXFwuMTAwXFwpIHR5cGUvKVxuXG4gIGFzc2VydC5lcXVhbChDb2xvcih7YWxwaGE6IDIwfSkgKyBcIlwiLFxuICAgICAgICAgICAgICAgYENvbG9yKHsgXCJyZWRcIjogMCwgXCJncmVlblwiOiAwLCBcImJsdWVcIjogMCwgXCJhbHBoYVwiOiAyMCB9KWApXG5cbn0pXG5cbnRlc3QoXCJVbmlvbiB0eXBlXCIsIGFzc2VydCA9PiB7XG4gIGNvbnN0IFN0YXR1cyA9IFJlY29yZCh7XG4gICAgcmVhZHlTdGF0ZTogVW5pb24oTnVtYmVyLCBTdHJpbmcpXG4gIH0pXG5cblxuICBhc3NlcnQudGhyb3dzKF8gPT4gU3RhdHVzKCksXG4gICAgICAgICAgICAgICAgL1widW5kZWZpbmVkXCIgZG9lcyBub3Qgc2F0aXNmeSBVbmlvblxcKE51bWJlciwgU3RyaW5nXFwpLylcblxuICBhc3NlcnQuZXF1YWwoU3RhdHVzKHtyZWFkeVN0YXRlOiBcImxvYWRpbmdcIn0pLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICBgVHlwZWQuUmVjb3JkKHtyZWFkeVN0YXRlOiBVbmlvbihOdW1iZXIsIFN0cmluZyl9KSh7IFwicmVhZHlTdGF0ZVwiOiBcImxvYWRpbmdcIiB9KWApXG5cbn0pXG5cblxudGVzdChcIlVuaW9uIG9mIHNpbWlsYXIgcmVjb3Jkc1wiLCBhc3NlcnQgPT4ge1xuICBjb25zdCBBZGQgPSBSZWNvcmQoe2lkOiBOdW1iZXIoMCl9KVxuICBjb25zdCBSZW1vdmUgPSBSZWNvcmQoe2lkOiBOdW1iZXIoMCl9KVxuICBjb25zdCBBY3Rpb24gPSBSZWNvcmQoe2FjdGlvbjogVW5pb24oQWRkLCBSZW1vdmUpfSlcblxuICBjb25zdCBhZGQgPSBBZGQoKVxuICBjb25zdCByZW1vdmUgPSBSZW1vdmUoKVxuICBjb25zdCBhbWJpZ2l1cyA9IHtpZDogMX1cblxuXG4gIGFzc2VydC5lcXVhbChBY3Rpb24oe2FjdGlvbjogYWRkfSkuYWN0aW9uLCBhZGQsIFwicmVjb2duaXplcyBBZGRcIilcbiAgYXNzZXJ0LmVxdWFsKEFjdGlvbih7YWN0aW9uOiByZW1vdmV9KS5hY3Rpb24sIHJlbW92ZSwgXCJyZWNvZ25pemVzIFJlbW92ZVwiKVxuICBhc3NlcnQub2soQWN0aW9uKHthY3Rpb246IGFtYmlnaXVzfSkuYWN0aW9uIGluc3RhbmNlb2YgQWRkLCBcIm1hdGNoZXMgQWRkXCIpXG59KVxuIl19