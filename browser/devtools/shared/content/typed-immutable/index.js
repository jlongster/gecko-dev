(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./record", "./list", "./typed"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./record"), require("./list"), require("./map"), require("./typed"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.record, global.list, global.typed);
    global.index = mod.exports;
  }
})(this, function (exports, _record, _list, _map, _typed) {
  "use strict";

  Object.defineProperty(exports, "Record", {
    enumerable: true,
    get: function get() {
      return _record.Record;
    }
  });
  Object.defineProperty(exports, "List", {
    enumerable: true,
    get: function get() {
      return _list.List;
    }
  });
  Object.defineProperty(exports, "Map", {
    enumerable: true,
    get: function get() {
      return _map.Map;
    }
  });
  Object.defineProperty(exports, "Typed", {
    enumerable: true,
    get: function get() {
      return _typed.Typed;
    }
  });
  Object.defineProperty(exports, "typeOf", {
    enumerable: true,
    get: function get() {
      return _typed.typeOf;
    }
  });
  Object.defineProperty(exports, "Type", {
    enumerable: true,
    get: function get() {
      return _typed.Type;
    }
  });
  Object.defineProperty(exports, "Any", {
    enumerable: true,
    get: function get() {
      return _typed.Any;
    }
  });
  Object.defineProperty(exports, "Union", {
    enumerable: true,
    get: function get() {
      return _typed.Union;
    }
  });
  Object.defineProperty(exports, "Maybe", {
    enumerable: true,
    get: function get() {
      return _typed.Maybe;
    }
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQVEsTUFBTTs7Ozs7O21CQUNOLElBQUk7Ozs7OztvQkFDSixLQUFLOzs7Ozs7b0JBQUUsTUFBTTs7Ozs7O29CQUFFLElBQUk7Ozs7OztvQkFBRSxHQUFHOzs7Ozs7b0JBQUUsS0FBSzs7Ozs7O29CQUFFLEtBQUsiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge1JlY29yZH0gZnJvbSBcIi4vcmVjb3JkXCJcbmV4cG9ydCB7TGlzdH0gZnJvbSBcIi4vbGlzdFwiXG5leHBvcnQge1R5cGVkLCB0eXBlT2YsIFR5cGUsIEFueSwgVW5pb24sIE1heWJlfSBmcm9tIFwiLi90eXBlZFwiXG4iXX0=
