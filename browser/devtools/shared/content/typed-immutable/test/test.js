(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "tape"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("tape"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tape);
    global.test = mod.exports;
  }
})(this, function (exports, _tape) {
  "use strict";

  exports["default"] = function (description, unit) {
    return _tape.test(description, function (test) {
      var result = unit(test);
      if (result && result.then) {
        result.then(function (_) {
          return test.end();
        }, function (error) {
          return test.end(error || true);
        });
      } else {
        test.end();
      }
    });
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L3Rlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O3VCQUVlLFVBQUMsV0FBVyxFQUFFLElBQUk7V0FBSyxNQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBQSxJQUFJLEVBQUk7QUFDbkUsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3pCLFVBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDekIsY0FBTSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7aUJBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtTQUFBLEVBQUUsVUFBQSxLQUFLO2lCQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztTQUFBLENBQUMsQ0FBQTtPQUMvRCxNQUFNO0FBQ0wsWUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO09BQ1g7S0FDRixDQUFDO0dBQUEiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHRhcGUgZnJvbSBcInRhcGVcIlxuXG5leHBvcnQgZGVmYXVsdCAoZGVzY3JpcHRpb24sIHVuaXQpID0+IHRhcGUudGVzdChkZXNjcmlwdGlvbiwgdGVzdCA9PiB7XG4gIGNvbnN0IHJlc3VsdCA9IHVuaXQodGVzdClcbiAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgIHJlc3VsdC50aGVuKF8gPT4gdGVzdC5lbmQoKSwgZXJyb3IgPT4gdGVzdC5lbmQoZXJyb3IgfHwgdHJ1ZSkpXG4gIH0gZWxzZSB7XG4gICAgdGVzdC5lbmQoKVxuICB9XG59KVxuIl19