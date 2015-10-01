module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.sample = __webpack_require__(1);
	exports.types = __webpack_require__(3);

	var errors = __webpack_require__(6);
	exports.FailureError = errors.FailureError;
	exports.GentestError = errors.GentestError;

	exports.Property = __webpack_require__(8);
	exports.Runner = __webpack_require__(9);
	exports.AsyncRunner = __webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var PRNG = __webpack_require__(2);

	var DEFAULT_COUNT = 10;

	function getRoot(tree) {
	  return tree.root;
	}

	// TODO: should this have a size parameter? Should gentest.run be modified
	// to use this routine instead of doing its own sampling?
	// raw is a secret undocumented option to enable debugging gentest itself.
	// If true, this returns the entire tree for each generated value so shrunk
	// versions can be examined.
	function sample(gen, count, raw) {
	  if (arguments.length < 2) {
	    count = DEFAULT_COUNT;
	  }

	  var rng = new PRNG(Date.now() & 0xffffffff);
	  var results = new Array(count);
	  for (var i = 0; i < count; i++) {
	    results[i] = gen(rng, Math.floor(i/2) + 1);
	  }
	  return raw ? results : results.map(getRoot);
	}

	module.exports = sample;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function BurtlePRNG(seed) {
	  if (arguments.length < 1) {
	    throw new TypeError('BurtlePRNG constructor requires a seed');
	  }
	  seed >>>= 0;
	  var ctx = this.ctx = new Array(4);
	  ctx[0] = 0xf1ea5eed;
	  ctx[1] = ctx[2] = ctx[3] = seed;
	  for (var i = 0; i < 20; i++) {
	    this.next();
	  }
	  return this;
	}

	function rot(x, k) {
	  return (x << k) | (x >> (32-k));
	}

	BurtlePRNG.prototype.next = function() {
	  var ctx = this.ctx;
	  var e =           (ctx[0] - rot(ctx[1], 27))>>>0;
	  ctx[0] = (ctx[1] ^ rot(ctx[2], 17))>>>0;
	  ctx[1] = (ctx[2] + ctx[3])>>>0;
	  ctx[2] = (ctx[3] + e)>>>0;
	  ctx[3] = (e      + ctx[0])>>>0;
	  return ctx[3];
	};

	BurtlePRNG.prototype['float'] = function() {
	  return this.next() / 4294967296.0;
	};

	if (true) {
	  module.exports = BurtlePRNG;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Basic generators and functions to combine them.

	var RoseTree = __webpack_require__(4);
	var errors = __webpack_require__(6);
	var shrink = __webpack_require__(7);

	var t = {};

	// Returns a generator that ignores size and generates integers
	// from low to high, inclusive, shrinking towards center, if
	// provided.
	t.choose = function(low, high, center) {
	  if (arguments.length < 3) {
	    center = low;
	  }

	  return function(rng, _size) {
	    var n = Math.floor(rng.float() * (high - low + 1) + low);
	    return new RoseTree(
	      n,
	      function() { return shrink.int(n, center); }
	    );
	  };
	};

	t.int = function(rng, size) {
	  return t.choose(-size, size, 0)(rng, size);
	};

	t.int.nonNegative = function(rng, size) {
	  return t.choose(0, size)(rng, size);
	};

	t.int.positive = function(rng, size) {
	  return t.choose(1, size + 1)(rng, size);
	};

	t.suchThat = function(pred, gen, maxTries) {
	  if (arguments.length < 3) maxTries = 10;

	  return function(rng, size) {
	    var triesLeft = maxTries;
	    var tree;
	    do {
	      tree = gen(rng, size);
	      if (pred(tree.root)) {
	        return tree.filterSubtrees(pred);
	      }
	    } while(--triesLeft > 0);
	    throw new errors.GentestError('suchThat: could not find a suitable value');
	  };
	};

	function isNonzero(x) {
	  return x !== 0;
	}

	t.int.nonZero = t.suchThat(isNonzero, t.int);

	// FIXME: This should eventually generate non-ASCII characters, I guess.
	t.char = function(rng, _size) {
	  return t.choose(32, 126)(rng, _size).map(function(n) {
	    return String.fromCharCode(n);
	  });
	};

	t.arrayOf = function(elemGen) {
	  return function(rng, size) {
	    var len = t.int.nonNegative(rng, size).root;

	    var elemTrees = new Array(len);
	    for (var i = 0; i < len; i++) {
	      elemTrees[i] = elemGen(rng, size);
	    }

	    return new RoseTree(
	      elemTrees.map(function(tree) { return tree.root; }),
	      function() {
	        return shrink.array(elemTrees, true);
	      }
	    );
	  };
	};

	t.tuple = function(gens) {
	  var len = gens.length;
	  return function(rng, size) {
	    var elemTrees = new Array(len);
	    for (var i = 0; i < len; i++) {
	      elemTrees[i] = gens[i](rng, size);
	    }

	    return new RoseTree(
	      elemTrees.map(function(tree) { return tree.root; }),
	      function() {
	        return shrink.array(elemTrees, false);
	      }
	    );
	  };
	};

	// (a -> b) -> Gen a -> Gen b
	// or
	// (a -> b) -> (PRNG -> Int -> RoseTree a) -> (PRNG -> Int -> RoseTree b)
	t.fmap = function(fun, gen) {
	  return function(rng, size) {
	    return gen(rng, size).map(fun);
	  };
	};

	// Gen a -> (a -> Gen b) -> Gen b
	// or
	// (PRNG -> Int -> RoseTree a)
	//  -> (a -> (PRNG -> Int -> RoseTree b))
	//  -> (PRNG -> Int -> RoseTree b)
	t.bind = function(gen, fun) {
	  return function(rng, size) {
	    return gen(rng, size).flatmap(function(value) {
	      return fun(value)(rng, size);
	    });
	  };
	};

	t.string = t.fmap(function(chars) {
	  return chars.join('');
	}, t.arrayOf(t.char));

	t.constantly = function(x) {
	  return function(_rng, _size) {
	    return new RoseTree(x);
	  };
	};

	t.oneOf = function(gens) {
	  if (gens.length < 1) {
	    throw new errors.GentestError('Empty array passed to oneOf');
	  }
	  if (gens.length === 1) {
	    return gens[0];
	  }
	  return t.bind(
	    t.choose(0, gens.length-1),
	    function(genIndex) {
	      return gens[genIndex];
	    }
	  );
	};

	t.elements = function(elems) {
	  if (elems.length < 1) {
	    throw new errors.GentestError('Empty array passed to elements');
	  }
	  return t.oneOf(elems.map(t.constantly));
	};

	t.bool = t.elements([false, true]);

	// Creates objects resembling the template `obj`, where each
	// value in `obj` is a type generator.
	t.shape = function(obj) {
	  var attributeNames = [];
	  var gens = [];

	  Object.keys(obj).forEach(function(key) {
	    attributeNames.push(key);
	    gens.push(obj[key]);
	  });

	  var shapeify = function(tuple) {
	    var obj = {};
	    for (var i = 0; i < tuple.length; i++) {
	      obj[attributeNames[i]] = tuple[i];
	    }
	    return obj;
	  };

	  return t.fmap(shapeify, t.tuple(gens));
	};

	module.exports = t;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Lazy rose trees and functions to operate on them.
	//
	// A rose tree consists of a value and an array of children,
	// all of which are themselves rose trees. To make them lazy,
	// the array of children is represented by a thunk.

	var Thunk = __webpack_require__(5);

	var emptyThunk = new Thunk(function() { return []; });

	// Constructor. Takes root value and a zero-argument function
	// to call to produce the children. If childrenFunc is not
	// provided, the root has no children.
	// data RoseTree a = RoseTree a (RoseTree a)
	var RoseTree = function(root, childrenFunc) {
	  if (!(this instanceof RoseTree)) {
	    return new RoseTree(root, childrenFunc);
	  }
	  this.root = root;
	  this._children = childrenFunc ? new Thunk(childrenFunc) : emptyThunk;
	};

	// "Flatten" a tree one level. (Monadic join.)
	// RoseTree (RoseTree a) -> RoseTree a
	function flatten(tree) {
	  if (!(tree.root instanceof RoseTree)) {
	    throw new TypeError("Can't call flatten when elements aren't trees");
	  }

	  return new RoseTree(
	    tree.root.root,
	    function() {
	      var innerChildren = tree.root.children();
	      var outerChildren = tree.children().map(flatten);
	      return outerChildren.concat(innerChildren);
	    }
	  );
	}

	// (a -> b) -> RoseTree a -> RoseTree b
	function fmap(f, tree) {
	  return new RoseTree(
	    f(tree.root),
	    function() {
	      return tree.children().map(fmap.bind(null, f));
	    }
	  );
	}

	// RoseTree a -> (a -> Bool) -> RoseTree a
	function filterSubtrees(pred, tree) {
	  return new RoseTree(
	    tree.root,
	    function() {
	      return tree.children().filter(function(subtree) {
	        return pred(subtree.root);
	      }).map(filterSubtrees.bind(null, pred));
	    }
	  );
	}

	RoseTree.prototype = {
	  // Returns the node's immediate children, realizing them if necessary.
	  // RoseTree a -> [RoseTree a]
	  children: function() {
	    return this._children.get();
	  },

	  // Map a function over each element's value. This is fmap, but with
	  // arguments reversed in keeping with the faux-OO method interface:
	  // RoseTree a -> (a -> b) -> RoseTree b
	  map: function(f) {
	    return fmap(f, this);
	  },

	  // Monadic bind. Same as map but here the function is assumed to yield
	  // a rose tree for each element. In Haskell, the type would be:
	  // RoseTree a -> (a -> RoseTree b) -> RoseTree b
	  // I didn't call this 'bind' to avoid confusion with Function#bind.
	  flatmap: function(f) {
	    return flatten(fmap(f, this));
	  },

	  // Filters out all descendants whose roots do not satisfy the predicate.
	  // Does not check the root against the predicate.
	  // RoseTree a -> (a -> Bool) -> RoseTree a
	  filterSubtrees: function(pred) {
	    return filterSubtrees(pred, this);
	  }
	};

	module.exports = RoseTree;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	// A small wrapper for thunks that caches the realized value.
	//
	// Public API:
	//  .get(): Forces evaluation and returns the value.

	var Thunk = function(f) {
	  if (!(this instanceof Thunk)) {
	    return new Thunk(f);
	  }

	  this._f = f;
	  this._realized = false;
	  return this;
	};

	Thunk.prototype = {
	  get: function() {
	    if (!this._realized) {
	      this._value = this._f();
	      this._realized = true;
	      this._f = null;  // Allow closure to be garbage-collected.
	    }
	    return this._value;
	  }
	};

	module.exports = Thunk;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var ErrorSubclass = function ErrorSubclass() {};
	ErrorSubclass.prototype = Error.prototype;

	var GentestError = function GentestError() {
	  if (!this instanceof GentestError) {
	    throw new TypeError('GentestError must be called via new');
	  }
	  var tmp = Error.prototype.constructor.apply(this, arguments);
	  if (tmp.stack) {
	    this.stack = tmp.stack.replace(/^Error/, 'GentestError');
	  }
	  if (tmp.message) {
	    this.message = tmp.message;
	  }
	  this.name = 'GentestError';
	  return this;
	};
	GentestError.prototype = new ErrorSubclass();
	GentestError.prototype.constructor = GentestError;

	var FailureError = function FailureError() {
	  GentestError.prototype.constructor.apply(this, arguments);
	  if (this.stack) {
	    this.stack = this.stack.replace(/^GentestError/, 'FailureError');
	  }
	  this.name = 'FailureError';
	};
	FailureError.prototype = new GentestError();
	FailureError.prototype.constructor = FailureError;

	exports.GentestError = GentestError;
	exports.FailureError = FailureError;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Routines to shrink primitive types, returning a rose tree of
	// "smaller" values of that type, with more drastic shrinking
	// possibilities appearing first.

	var RoseTree = __webpack_require__(4);


	// Bear with me... the next two functions may look a little
	// confusing, but they enable the individual shrink functions
	// to avoid dealing directly with rose trees.
	//
	// XXX: Is this approach still worthwhile given I only ended up
	// using these on one shrink function?


	// Given array and fun, returns an array of rose trees where each
	// tree's root is the element and its children are fun(element).
	// [a] -> (a -> [a]) -> RoseTree a
	function arrayToRoseTrees(array, fun) {
	  return array.map(function(element) {
	    return new RoseTree(element, function() { return fun(element); });
	  });
	}

	// Takes a shrink function that returns a list of smaller values,
	// and returns a shrink function that returns a rose tree, with
	// the same shrink function used for further shrinks.
	//
	// (a -> [a]) -> (a -> [RoseTree a])
	// ... with a caveat:
	//
	// If f takes 2 or more args, we assume the first arg is the value
	// to shrink and we replace that in recursive calls while propagating
	// the rest.
	function roseify(f) {
	  var roseified = function() {
	    var restArgs = [].slice.call(arguments, 1);
	    return arrayToRoseTrees(
	      f.apply(null, arguments),
	      function(value) {
	        return roseified.apply(null, [value].concat(restArgs));
	      }
	    );
	  };
	  return roseified;
	}


	// Now that we have roseify, we'll write all our shrink functions
	// to simply return lists, then wrap each shrink function with
	// roseify.

	function roundTowardZero(x) {
	  if (x < 0) {
	    return Math.ceil(x);
	  }
	  return Math.floor(x);
	}

	// Shrink integer n towards center.
	// If n !== center, at least center and the integer one closer to center
	// are guaranteed to be tried.
	exports.int = roseify(function(n, center) {
	  var diff = center - n;
	  var out = [];
	  while (Math.abs(diff) >= 1) {
	    out.push(n + roundTowardZero(diff));
	    diff /= 2;
	  }
	  return out;
	});

	// Array shrinking takes an array of rose trees, so we can use the
	// shrunken versions of each individual element.
	// If tryRemoving is falsy, we will only shrink individual elements,
	// not attempt removing elements. This makes the same shrink function
	// suitable for tuples (i.e. fixed-length, heterogeneous arrays).
	// shrink.array :: [RoseTree a] -> Bool -> [RoseTree [a]]
	exports.array = function(xtrees, tryRemoving) {
	  var withElemsRemoved = []; // [[RoseTree a]]
	  var withElemsShrunk = []; // [[RoseTree a]]
	  var i;

	  // For each element, push a modified array with that element removed
	  // to withElemsRemoved, and potentially many modified arrays with that
	  // element shrunk to withElemsShrunk.
	  xtrees.forEach(function(xtree, index) {
	    var xtreesBefore = xtrees.slice(0, index);
	    var xtreesAfter  = xtrees.slice(index + 1);

	    if (tryRemoving) {
	      withElemsRemoved.push(xtreesBefore.concat(xtreesAfter));
	    }

	    xtree.children().forEach(function(childNode) {
	      var withAnElemShrunk = xtreesBefore.concat([childNode])
	                                         .concat(xtreesAfter);
	      withElemsShrunk.push(withAnElemShrunk);
	    });
	  });

	  // xtreesToArray :: [RoseTree a] -> RoseTree [a]
	  // FIXME: This is duplication of code in types.arrayOf.
	  var xtreesToArray = function(xts) {
	    return new RoseTree(
	      xts.map(function(tree) { return tree.root; }),
	      function() {
	        return exports.array(xts, tryRemoving);
	      }
	    );
	  };

	  return withElemsRemoved.concat(withElemsShrunk).map(xtreesToArray);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Create properties from functions.

	var errors = __webpack_require__(6);
	var types = __webpack_require__(3);

	var Property = function(func, name, gen) {
	  if (!(this instanceof Property)) {
	    return new Property(func, name, gen);
	  }

	  if (typeof func !== 'function' ||
	      typeof name !== 'string' ||
	      typeof gen !== 'function') {
	    throw new errors.GentestError('Property constructor called with ' +
	                                  'invalid arguments');
	  }

	  this._func = func;
	  this.name = name;
	  this._gen = gen;
	};

	// Generate a test case for the property.
	Property.prototype.genTest = function(rng, size) {
	  if (typeof size !== 'number' || size < 1) {
	    throw new errors.GentestError('size must be a positive integer');
	  }
	  size |= 0;
	  return this._gen(rng, size);
	};

	// Run a test case as returned from genTest.
	// Returns an object:
	// {
	//   success: [boolean],
	//   error: [if an uncaught exception was raised, the exception],
	// }
	Property.prototype.runTest = function(testCase) {
	  var result = {};

	  try {
	    result.success = this._func.apply(null, testCase.root);
	  } catch(e) {
	    result.success = false;
	    result.error = e;
	  }

	  return result;
	};

	// Returns an iterator (compliant with the ES6 iterator protocol) over
	// shrunk versions of the failing `testCase`. This should be a test
	// case returned by `.genTest` and which has resulted in a `{success:
	// false}` return value from `.runTest`.
	//
	// Concretely, calling `.next()` on the returned iterator causes a
	// shrunk test case to be executed, if any remain to be tried. The
	// iterator will return something like:
	//
	// {
	//   done: false,
	//   value: {
	//     testArgs: [the arguments tested],
	//     result: [same as return value of .runTest()]
	//   }
	// }
	//
	// When the iterator finishes by returning `{done: true}`, the last
	// value it produced where `result.success === false` (or the original
	// `testCase`, if no such value was produced) should be considered the
	// minimum failing test case.
	//
	Property.prototype.shrinkFailingTest = function(testCase) {
	  // Implementation note: This would be clearer with coroutines (aka ES6
	  // "generators" — unfortunate clash of terminology there). This function
	  // basically fakes a coroutine, which requires explicitly keeping track
	  // of the state between return values, namely:
	  var node = testCase;  // The node whose children we are exploring.
	  var childIndex = 0;   // The index of the child to explore next.
	  var prop = this;      // (constant) Reference to `this`.

	  return {next: function() {
	    if (childIndex >= node.children().length) {
	      return {done: true};
	    }

	    var child = node.children()[childIndex];
	    var result = prop.runTest(child);
	    if (!result.success) {
	      node = child;
	      childIndex = 0;
	    } else {
	      childIndex++;
	    }

	    return {
	      done: false,
	      value: {
	        testArgs: child.root,
	        result: result
	      }
	    };
	  }};
	};

	// Implement the forAll(args, name, func) sugar, returning a Property.
	Property.forAll = function(args, name, func) {
	  // `args` may be an array of generators (positional arguments to `func`),
	  // or an object with generators as values (named members of a single
	  // object passed to `func`). Either way, we give the Property constructor
	  // a single generator that generates an array of arguments.
	  var gen = Array.isArray(args) ? types.tuple(args)
	                                : types.tuple(types.shape(args));

	  return new Property(func, name, gen);
	};

	module.exports = Property;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Test runner for properties.

	var PRNG = __webpack_require__(2);
	var errors = __webpack_require__(6);

	var Runner = function() {
	  this._currentCategory = [];
	  this._categories = [{props: this._currentCategory}];
	};

	Runner.prototype.newCategory = function(name) {
	  this._currentCategory = [];
	  this._categories.push({name: name, props: this._currentCategory});
	};

	Runner.prototype.newProp = function(prop) {
	  // prop should be an instance of Property
	  this._currentCategory.push(prop);
	};

	// Given float `ratio` in [0, 1], return integer value in [min, max].
	// interpolate(min, max, 0.0) === min
	// interpolate(min, max, 1.0) === max
	function interpolate(min, max, ratio) {
	  return Math.floor(ratio * ((max + 0.5) - min) + min);
	}

	Runner.prototype.run = function(options) {
	  var seed = ((options.seed || Date.now()) & 0xffffffff) | 0;
	  var grep = options.grep;
	  var numTests = options.numTests || 100;
	  var maxSize = options.maxSize || 50;
	  var write = options.silent ? function() {} : dump;

	  var propsRun = 0;
	  var propsFailed = 0;

	  var rng = new PRNG(seed);

	  for (var i = 0; i < this._categories.length; i++) {
	    var cat = this._categories[i];
	    var catProps = cat.props;

	    if (grep) {
	      catProps = catProps.filter(function(prop) {
	        return prop.name.indexOf(grep) !== -1;
	      });
	    }

	    if (cat.length < 1) continue;

	    if (cat.name) {
	      write('\n' + cat.name + ':\n');
	    }

	    for (var j = 0; j < catProps.length; j++) {
	      var prop = catProps[j];
	      var success = true;
	      var error;
	      var testCaseTree;
	      var failingCase;

	      for (var k = 1; k <= numTests; k++) {
	        write('\r' + k + '/' + numTests + ' ' + prop.name);
	        var size = interpolate(1, maxSize, k/numTests);
	        testCaseTree = prop.genTest(rng, size);
	        var result = prop.runTest(testCaseTree);

	        if (!result.success) {
	          success = false;
	          error = result.error;
	          break;
	        }
	      }

	      if (!success) {
	        var iter = prop.shrinkFailingTest(testCaseTree);
	        var numAttempts = 0;
	        var numShrinks = 0;

	        failingCase = testCaseTree.root;
	        testCaseTree = null;  // Allow GC of unused parts of the tree.

	        var ret;
	        while (!((ret = iter.next()).done)) {
	          var value = ret.value;
	          numAttempts++;
	          if (!value.result.success) {
	            numShrinks++;
	            failingCase = value.testArgs;
	          }
	          write('\r' + k + '/' + numTests + ' ' + prop.name +
	                ', shrinking ' + numShrinks + '/' + numAttempts);
	        }
	      }

	      write('\r' + (success ? '✓' : '✘') + ' ' + prop.name);
	      propsRun++;
	      if (success) {
	        write(', passed ' + numTests + ' tests\n');
	      } else {
	        propsFailed++;
	        write(', counterexample found:\n');
	        write(failingCase.toString() + '\n');
	        if (error) {
	          write('exception raised: ' + (error.name || '(no name)') + '\n');
	          write(error.stack + '\n');
	        }
	      }
	    }
	  }

	  write('\n' + (propsFailed > 0 ? propsFailed + ' of ' : '') +
	        propsRun + ' ' + (propsRun === 1 ? 'property' : 'properties') +
	        ' ' + (propsFailed > 0 ? 'violated' : 'verified') + '.\n');
	};

	module.exports = Runner;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var PRNG = __webpack_require__(2);

	function interpolate(min, max, ratio) {
	  return Math.floor(ratio * ((max + 0.5) - min) + min);
	}

	function runTest(prop, rng, i, numTests, maxSize, cb) {
	  var size = interpolate(1, maxSize, i/numTests);
	  var testCaseTree = prop.genTest(rng, size);
	  var result = prop.runTest(testCaseTree);

	  if(!result.success) {
	    cb({
	      error: result.error,
	      testCaseTree: testCaseTree
	    });
	  }
	  else {
	    cb(null, result);
	  }
	}

	module.exports = function(prop, opts) {
	  var seed = ((opts.seed || Date.now()) & 0xffffffff) | 0;
	  var numTests = opts.numTests || 100;
	  var maxSize = opts.maxSize || 50;
	  var rng = new PRNG(seed);
	  var testCaseTree;

	  function _run(i) {
	    if(i > numTests) {
	      dump('great, it worked!\n');
	      return;
	    }

	    runTest(prop, rng, i, numTests, maxSize, function(err, res) {
	      if(err) {
	        handleError(err);
	      }
	      else {
	        setTimeout(function() { _run(i + 1); }, 0);
	      }
	    });
	  }

	  function handleError(err) {
	    dump('bad error: ' + err.error + '\n');
	  }

	  _run(0);
	}


/***/ }
/******/ ]);