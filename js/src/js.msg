/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * This is the JavaScript error message file.
 *
 * The format for each JS error message is:
 *
 * MSG_DEF(<SYMBOLIC_NAME>, <ARGUMENT_COUNT>, <EXCEPTION_NAME>,
 *         <FORMAT_STRING>)
 *
 * where ;
 * <SYMBOLIC_NAME> is a legal C identifer that will be used in the
 * JS engine source.
 *
 * <ARGUMENT_COUNT> is an integer literal specifying the total number of
 * replaceable arguments in the following format string.
 *
 * <EXCEPTION_NAME> is an exception index from the enum in jsexn.c;
 * JSEXN_NONE for none.  The given exception index will be raised by the
 * engine when the corresponding error occurs.
 *
 * <FORMAT_STRING> is a string literal, optionally containing sequences
 * {X} where X  is an integer representing the argument number that will
 * be replaced with a string value when the error is reported.
 *
 * e.g.
 *
 * MSG_DEF(JSMSG_NOT_A_SUBSPECIES, 2, JSEXN_NONE,
 *         "{0} is not a member of the {1} family")
 *
 * can be used:
 *
 * JS_ReportErrorNumber(JSMSG_NOT_A_SUBSPECIES, "Rhino", "Monkey");
 *
 * to report:
 *
 * "Rhino is not a member of the Monkey family"
 */

MSG_DEF(JSMSG_NOT_AN_ERROR,            0, JSEXN_NONE, "<Error #0 is reserved>")
MSG_DEF(JSMSG_NOT_DEFINED,             1, JSEXN_REFERENCEERR, "{0} is not defined")
MSG_DEF(JSMSG_MORE_ARGS_NEEDED,        3, JSEXN_TYPEERR, "{0} requires more than {1} argument{2}")
MSG_DEF(JSMSG_INCOMPATIBLE_PROTO,      3, JSEXN_TYPEERR, "{0}.prototype.{1} called on incompatible {2}")
MSG_DEF(JSMSG_NO_CONSTRUCTOR,          1, JSEXN_TYPEERR, "{0} has no constructor")
MSG_DEF(JSMSG_BAD_SORT_ARG,            0, JSEXN_TYPEERR, "invalid Array.prototype.sort argument")
MSG_DEF(JSMSG_CANT_WATCH,              1, JSEXN_TYPEERR, "can't watch non-native objects of class {0}")
MSG_DEF(JSMSG_READ_ONLY,               1, JSEXN_TYPEERR, "{0} is read-only")
MSG_DEF(JSMSG_CANT_DELETE,             1, JSEXN_TYPEERR, "property {0} is non-configurable and can't be deleted")
MSG_DEF(JSMSG_NOT_FUNCTION,            1, JSEXN_TYPEERR, "{0} is not a function")
MSG_DEF(JSMSG_NOT_CONSTRUCTOR,         1, JSEXN_TYPEERR, "{0} is not a constructor")
MSG_DEF(JSMSG_CANT_CONVERT,            1, JSEXN_ERR, "can't convert {0} to an integer")
MSG_DEF(JSMSG_CANT_CONVERT_TO,         2, JSEXN_TYPEERR, "can't convert {0} to {1}")
MSG_DEF(JSMSG_NO_PROPERTIES,           1, JSEXN_TYPEERR, "{0} has no properties")
MSG_DEF(JSMSG_BAD_REGEXP_FLAG,         1, JSEXN_SYNTAXERR, "invalid regular expression flag {0}")
MSG_DEF(JSMSG_ARG_INDEX_OUT_OF_RANGE,  1, JSEXN_RANGEERR, "argument {0} accesses an index that is out of range")
MSG_DEF(JSMSG_SPREAD_TOO_LARGE,        0, JSEXN_RANGEERR, "array too large due to spread operand(s)")
MSG_DEF(JSMSG_BAD_WEAKMAP_KEY,         0, JSEXN_TYPEERR, "cannot use the given object as a weak map key")
MSG_DEF(JSMSG_BAD_GETTER_OR_SETTER,    1, JSEXN_TYPEERR, "invalid {0} usage")
MSG_DEF(JSMSG_BAD_ARRAY_LENGTH,        0, JSEXN_RANGEERR, "invalid array length")
MSG_DEF(JSMSG_REDECLARED_VAR,          2, JSEXN_TYPEERR, "redeclaration of {0} {1}")
MSG_DEF(JSMSG_UNDECLARED_VAR,          1, JSEXN_REFERENCEERR, "assignment to undeclared variable {0}")
MSG_DEF(JSMSG_GETTER_ONLY,             0, JSEXN_TYPEERR, "setting a property that has only a getter")
MSG_DEF(JSMSG_UNDEFINED_PROP,          1, JSEXN_REFERENCEERR, "reference to undefined property {0}")
MSG_DEF(JSMSG_INVALID_MAP_ITERABLE,    0, JSEXN_TYPEERR, "iterable for map should have array-like objects")
MSG_DEF(JSMSG_NESTING_GENERATOR,       0, JSEXN_TYPEERR, "already executing generator")
MSG_DEF(JSMSG_INCOMPATIBLE_METHOD,     3, JSEXN_TYPEERR, "{0} {1} called on incompatible {2}")
MSG_DEF(JSMSG_OBJECT_WATCH_DEPRECATED, 0, JSEXN_NONE, "Object.prototype.watch and unwatch are very slow, non-standard, and deprecated; use a getter/setter instead")
MSG_DEF(JSMSG_TYPE_ERR_BAD_ARGS,       0, JSEXN_TYPEERR, "invalid arguments")
MSG_DEF(JSMSG_BAD_SURROGATE_CHAR,      1, JSEXN_TYPEERR, "bad surrogate character {0}")
MSG_DEF(JSMSG_UTF8_CHAR_TOO_LARGE,     1, JSEXN_TYPEERR, "UTF-8 character {0} too large")
MSG_DEF(JSMSG_MALFORMED_UTF8_CHAR,     1, JSEXN_TYPEERR, "malformed UTF-8 character sequence at offset {0}")
MSG_DEF(JSMSG_WRONG_CONSTRUCTOR,       1, JSEXN_TYPEERR, "wrong constructor called for {0}")
MSG_DEF(JSMSG_BUILTIN_CTOR_NO_NEW,     1, JSEXN_NONE, "calling a builtin {0} constructor without new is deprecated and will be forbidden in ES6")
MSG_DEF(JSMSG_PROTO_SETTING_SLOW,      0, JSEXN_NONE, "mutating the [[Prototype]] of an object will cause your code to run very slowly; instead create the object with the correct initial [[Prototype]] value using Object.create")
MSG_DEF(JSMSG_BAD_GENERATOR_YIELD,     1, JSEXN_TYPEERR, "yield from closing generator {0}")
MSG_DEF(JSMSG_EMPTY_ARRAY_REDUCE,      0, JSEXN_TYPEERR, "reduce of empty array with no initial value")
MSG_DEF(JSMSG_UNEXPECTED_TYPE,         2, JSEXN_TYPEERR, "{0} is {1}")
MSG_DEF(JSMSG_MISSING_FUN_ARG,         2, JSEXN_TYPEERR, "missing argument {0} when calling function {1}")
MSG_DEF(JSMSG_NOT_NONNULL_OBJECT,      0, JSEXN_TYPEERR, "value is not a non-null object")
MSG_DEF(JSMSG_INVALID_DESCRIPTOR,      0, JSEXN_TYPEERR, "property descriptors must not specify a value or be writable when a getter or setter has been specified")
MSG_DEF(JSMSG_OBJECT_NOT_EXTENSIBLE,   1, JSEXN_TYPEERR, "{0} is not extensible")
MSG_DEF(JSMSG_CANT_REDEFINE_PROP,      1, JSEXN_TYPEERR, "can't redefine non-configurable property '{0}'")
MSG_DEF(JSMSG_CANT_APPEND_TO_ARRAY,    0, JSEXN_TYPEERR, "can't add elements past the end of an array if its length property is unwritable")
MSG_DEF(JSMSG_CANT_REDEFINE_ARRAY_LENGTH, 0, JSEXN_TYPEERR, "can't redefine array length")
MSG_DEF(JSMSG_CANT_DEFINE_PAST_ARRAY_LENGTH, 0, JSEXN_TYPEERR, "can't define array index property past the end of an array with non-writable length")
MSG_DEF(JSMSG_BAD_GET_SET_FIELD,       1, JSEXN_TYPEERR, "property descriptor's {0} field is neither undefined nor a function")
MSG_DEF(JSMSG_THROW_TYPE_ERROR,        0, JSEXN_TYPEERR, "'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them")
MSG_DEF(JSMSG_NOT_EXPECTED_TYPE,       3, JSEXN_TYPEERR, "{0}: expected {1}, got {2}")
MSG_DEF(JSMSG_NEED_DEBUG_MODE,         0, JSEXN_ERR, "function can be called only in debug mode")
MSG_DEF(JSMSG_NOT_ITERABLE,            1, JSEXN_TYPEERR, "{0} is not iterable")
MSG_DEF(JSMSG_ALREADY_HAS_PRAGMA,      2, JSEXN_NONE, "{0} is being assigned a {1}, but already has one")
MSG_DEF(JSMSG_NEXT_RETURNED_PRIMITIVE, 0, JSEXN_TYPEERR, "iterator.next() returned a non-object value")
MSG_DEF(JSMSG_WRONG_VALUE,             2, JSEXN_ERR, "expected {0} but found {1}")
MSG_DEF(JSMSG_SETPROTOTYPEOF_FAIL,     1, JSEXN_TYPEERR, "[[SetPrototypeOf]] failed on {0}")
MSG_DEF(JSMSG_INVALID_ARG_TYPE,        3, JSEXN_TYPEERR, "Invalid type: {0} can't be a{1} {2}")
MSG_DEF(JSMSG_TERMINATED,              1, JSEXN_ERR, "Script terminated by timeout at:\n{0}")

// JSON
MSG_DEF(JSMSG_JSON_BAD_PARSE,          3, JSEXN_SYNTAXERR, "JSON.parse: {0} at line {1} column {2} of the JSON data")
MSG_DEF(JSMSG_JSON_CYCLIC_VALUE,       1, JSEXN_TYPEERR, "cyclic {0} value")

// Runtime errors
MSG_DEF(JSMSG_BAD_INSTANCEOF_RHS,      1, JSEXN_TYPEERR, "invalid 'instanceof' operand {0}")
MSG_DEF(JSMSG_BAD_LEFTSIDE_OF_ASS,     0, JSEXN_REFERENCEERR, "invalid assignment left-hand side")
MSG_DEF(JSMSG_BAD_PROTOTYPE,           1, JSEXN_TYPEERR, "'prototype' property of {0} is not an object")
MSG_DEF(JSMSG_IN_NOT_OBJECT,           1, JSEXN_TYPEERR, "invalid 'in' operand {0}")
MSG_DEF(JSMSG_TOO_MANY_CON_SPREADARGS, 0, JSEXN_RANGEERR, "too many constructor arguments")
MSG_DEF(JSMSG_TOO_MANY_FUN_SPREADARGS, 0, JSEXN_RANGEERR, "too many function arguments")
MSG_DEF(JSMSG_UNINITIALIZED_LEXICAL,   1, JSEXN_REFERENCEERR, "can't access lexical declaration `{0}' before initialization")

// Date
MSG_DEF(JSMSG_INVALID_DATE,            0, JSEXN_RANGEERR, "invalid date")
MSG_DEF(JSMSG_BAD_TOISOSTRING_PROP,    0, JSEXN_TYPEERR, "toISOString property is not callable")

// String
MSG_DEF(JSMSG_BAD_URI,                 0, JSEXN_URIERR, "malformed URI sequence")
MSG_DEF(JSMSG_INVALID_NORMALIZE_FORM,  0, JSEXN_RANGEERR, "form must be one of 'NFC', 'NFD', 'NFKC', or 'NFKD'")
MSG_DEF(JSMSG_NEGATIVE_REPETITION_COUNT, 0, JSEXN_RANGEERR, "repeat count must be non-negative")
MSG_DEF(JSMSG_NOT_A_CODEPOINT,         1, JSEXN_RANGEERR, "{0} is not a valid code point")
MSG_DEF(JSMSG_RESULTING_STRING_TOO_LARGE, 0, JSEXN_RANGEERR, "repeat count must be less than infinity and not overflow maximum string size")

// Number
MSG_DEF(JSMSG_BAD_RADIX,               0, JSEXN_RANGEERR, "radix must be an integer at least 2 and no greater than 36")
MSG_DEF(JSMSG_PRECISION_RANGE,         1, JSEXN_RANGEERR, "precision {0} out of range")

// Function
MSG_DEF(JSMSG_BAD_APPLY_ARGS,          1, JSEXN_TYPEERR, "second argument to Function.prototype.{0} must be an array")
MSG_DEF(JSMSG_BAD_FORMAL,              0, JSEXN_SYNTAXERR, "malformed formal parameter")
MSG_DEF(JSMSG_CALLER_IS_STRICT,        0, JSEXN_TYPEERR, "access to strict mode caller function is censored")
MSG_DEF(JSMSG_DEPRECATED_USAGE,        1, JSEXN_REFERENCEERR, "deprecated {0} usage")
MSG_DEF(JSMSG_FUNCTION_ARGUMENTS_AND_REST, 0, JSEXN_TYPEERR, "the 'arguments' property of a function with a rest parameter may not be used")
MSG_DEF(JSMSG_NOT_SCRIPTED_FUNCTION,   1, JSEXN_TYPEERR, "{0} is not a scripted function")
MSG_DEF(JSMSG_NO_REST_NAME,            0, JSEXN_SYNTAXERR, "no parameter name after ...")
MSG_DEF(JSMSG_PARAMETER_AFTER_REST,    0, JSEXN_SYNTAXERR, "parameter after rest parameter")
MSG_DEF(JSMSG_TOO_MANY_FUN_APPLY_ARGS, 0, JSEXN_RANGEERR, "arguments array passed to Function.prototype.apply is too large")

// CSP
MSG_DEF(JSMSG_CSP_BLOCKED_EVAL,        0, JSEXN_ERR, "call to eval() blocked by CSP")
MSG_DEF(JSMSG_CSP_BLOCKED_FUNCTION,    0, JSEXN_ERR, "call to Function() blocked by CSP")

// Wrappers
MSG_DEF(JSMSG_ACCESSOR_DEF_DENIED,     1, JSEXN_ERR, "Permission denied to define accessor property '{0}'")
MSG_DEF(JSMSG_DEAD_OBJECT,             0, JSEXN_TYPEERR, "can't access dead object")
MSG_DEF(JSMSG_UNWRAP_DENIED,           0, JSEXN_ERR, "permission denied to unwrap object")

// JSAPI-only (Not thrown as JS exceptions)
MSG_DEF(JSMSG_BAD_CHAR,                1, JSEXN_INTERNALERR, "invalid format character {0}")
MSG_DEF(JSMSG_BAD_CLONE_FUNOBJ_SCOPE,  0, JSEXN_TYPEERR, "bad cloned function scope chain")
MSG_DEF(JSMSG_BAD_NEW_RESULT,          1, JSEXN_TYPEERR, "invalid new expression result {0}")
MSG_DEF(JSMSG_BAD_TYPE,                1, JSEXN_TYPEERR, "unknown type {0}")
MSG_DEF(JSMSG_CANT_CLONE_OBJECT,       0, JSEXN_TYPEERR, "can't clone object")
MSG_DEF(JSMSG_CANT_OPEN,               2, JSEXN_ERR, "can't open {0}: {1}")
MSG_DEF(JSMSG_USER_DEFINED_ERROR,      0, JSEXN_ERR, "JS_ReportError was called")

// Internal errors
MSG_DEF(JSMSG_ALLOC_OVERFLOW,          0, JSEXN_INTERNALERR, "allocation size overflow")
MSG_DEF(JSMSG_BAD_BYTECODE,            1, JSEXN_INTERNALERR, "unimplemented JavaScript bytecode {0}")
MSG_DEF(JSMSG_BAD_SCRIPT_MAGIC,        0, JSEXN_INTERNALERR, "bad script XDR magic number")
MSG_DEF(JSMSG_BUFFER_TOO_SMALL,        0, JSEXN_INTERNALERR, "buffer too small")
MSG_DEF(JSMSG_BYTECODE_TOO_BIG,        2, JSEXN_INTERNALERR, "bytecode {0} too large (limit {1})")
MSG_DEF(JSMSG_CANT_SET_ARRAY_ATTRS,    0, JSEXN_INTERNALERR, "can't set attributes on indexed array properties")
MSG_DEF(JSMSG_INACTIVE,                0, JSEXN_INTERNALERR, "nothing active on context")
MSG_DEF(JSMSG_NEED_DIET,               1, JSEXN_INTERNALERR, "{0} too large")
MSG_DEF(JSMSG_OUT_OF_MEMORY,           0, JSEXN_INTERNALERR, "out of memory")
MSG_DEF(JSMSG_OVER_RECURSED,           0, JSEXN_INTERNALERR, "too much recursion")
MSG_DEF(JSMSG_TOO_BIG_TO_ENCODE,       0, JSEXN_INTERNALERR, "data are to big to encode")
MSG_DEF(JSMSG_TOO_DEEP,                1, JSEXN_INTERNALERR, "{0} nested too deeply")
MSG_DEF(JSMSG_UNCAUGHT_EXCEPTION,      1, JSEXN_INTERNALERR, "uncaught exception: {0}")
MSG_DEF(JSMSG_UNKNOWN_FORMAT,          1, JSEXN_INTERNALERR, "unknown bytecode format {0}")

// Frontend
MSG_DEF(JSMSG_ACCESSOR_WRONG_ARGS,     3, JSEXN_SYNTAXERR, "{0} functions must have {1} argument{2}")
MSG_DEF(JSMSG_ARGUMENTS_AND_REST,      0, JSEXN_SYNTAXERR, "'arguments' object may not be used in conjunction with a rest parameter")
MSG_DEF(JSMSG_ARRAY_COMP_LEFTSIDE,     0, JSEXN_SYNTAXERR, "invalid array comprehension left-hand side")
MSG_DEF(JSMSG_ARRAY_INIT_TOO_BIG,      0, JSEXN_INTERNALERR, "array initialiser too large")
MSG_DEF(JSMSG_AS_AFTER_RESERVED_WORD,  1, JSEXN_SYNTAXERR, "missing keyword 'as' after reserved word '{0}'")
MSG_DEF(JSMSG_BAD_ANON_GENERATOR_RETURN, 0, JSEXN_TYPEERR, "anonymous generator function returns a value")
MSG_DEF(JSMSG_BAD_ARROW_ARGS,          0, JSEXN_SYNTAXERR, "invalid arrow-function arguments (parentheses around the arrow-function may help)")
MSG_DEF(JSMSG_BAD_BINDING,             1, JSEXN_SYNTAXERR, "redefining {0} is deprecated")
MSG_DEF(JSMSG_BAD_CONST_DECL,          0, JSEXN_SYNTAXERR, "missing = in const declaration")
MSG_DEF(JSMSG_BAD_CONTINUE,            0, JSEXN_SYNTAXERR, "continue must be inside loop")
MSG_DEF(JSMSG_BAD_DESTRUCT_ASS,        0, JSEXN_REFERENCEERR, "invalid destructuring assignment operator")
MSG_DEF(JSMSG_BAD_DESTRUCT_TARGET,     0, JSEXN_SYNTAXERR, "invalid destructuring target")
MSG_DEF(JSMSG_BAD_DESTRUCT_DECL,       0, JSEXN_SYNTAXERR, "missing = in destructuring declaration")
MSG_DEF(JSMSG_BAD_DUP_ARGS,            0, JSEXN_SYNTAXERR, "duplicate argument names not allowed in this context")
MSG_DEF(JSMSG_BAD_FOR_EACH_LOOP,       0, JSEXN_SYNTAXERR, "invalid for each loop")
MSG_DEF(JSMSG_BAD_FOR_LEFTSIDE,        0, JSEXN_SYNTAXERR, "invalid for/in left-hand side")
MSG_DEF(JSMSG_BAD_GENERATOR_RETURN,    1, JSEXN_TYPEERR, "generator function {0} returns a value")
MSG_DEF(JSMSG_BAD_GENERATOR_SYNTAX,    1, JSEXN_SYNTAXERR, "{0} expression must be parenthesized")
MSG_DEF(JSMSG_BAD_GENEXP_BODY,         1, JSEXN_SYNTAXERR, "illegal use of {0} in generator expression")
MSG_DEF(JSMSG_BAD_INCOP_OPERAND,       0, JSEXN_REFERENCEERR, "invalid increment/decrement operand")
MSG_DEF(JSMSG_BAD_OCTAL,               1, JSEXN_SYNTAXERR, "{0} is not a legal ECMA-262 octal constant")
MSG_DEF(JSMSG_BAD_OPERAND,             1, JSEXN_SYNTAXERR, "invalid {0} operand")
MSG_DEF(JSMSG_BAD_PROP_ID,             0, JSEXN_SYNTAXERR, "invalid property id")
MSG_DEF(JSMSG_BAD_RETURN_OR_YIELD,     1, JSEXN_SYNTAXERR, "{0} not in function")
MSG_DEF(JSMSG_BAD_STRICT_ASSIGN,       1, JSEXN_SYNTAXERR, "can't assign to {0} in strict mode")
MSG_DEF(JSMSG_BAD_SWITCH,              0, JSEXN_SYNTAXERR, "invalid switch statement")
MSG_DEF(JSMSG_BRACKET_AFTER_ARRAY_COMPREHENSION, 0, JSEXN_SYNTAXERR, "missing ] after array comprehension")
MSG_DEF(JSMSG_BRACKET_AFTER_LIST,      0, JSEXN_SYNTAXERR, "missing ] after element list")
MSG_DEF(JSMSG_BRACKET_IN_INDEX,        0, JSEXN_SYNTAXERR, "missing ] in index expression")
MSG_DEF(JSMSG_CATCH_AFTER_GENERAL,     0, JSEXN_SYNTAXERR, "catch after unconditional catch")
MSG_DEF(JSMSG_CATCH_IDENTIFIER,        0, JSEXN_SYNTAXERR, "missing identifier in catch")
MSG_DEF(JSMSG_CATCH_OR_FINALLY,        0, JSEXN_SYNTAXERR, "missing catch or finally after try")
MSG_DEF(JSMSG_CATCH_WITHOUT_TRY,       0, JSEXN_SYNTAXERR, "catch without try")
MSG_DEF(JSMSG_COLON_AFTER_CASE,        0, JSEXN_SYNTAXERR, "missing : after case label")
MSG_DEF(JSMSG_COLON_AFTER_ID,          0, JSEXN_SYNTAXERR, "missing : after property id")
MSG_DEF(JSMSG_COLON_IN_COND,           0, JSEXN_SYNTAXERR, "missing : in conditional expression")
MSG_DEF(JSMSG_COMP_PROP_UNTERM_EXPR,   0, JSEXN_SYNTAXERR, "missing ] in computed property name")
MSG_DEF(JSMSG_CONTRARY_NONDIRECTIVE,   1, JSEXN_SYNTAXERR, "'{0}' statement won't be enforced as a directive because it isn't in directive prologue position")
MSG_DEF(JSMSG_CURLY_AFTER_BODY,        0, JSEXN_SYNTAXERR, "missing } after function body")
MSG_DEF(JSMSG_CURLY_AFTER_CATCH,       0, JSEXN_SYNTAXERR, "missing } after catch block")
MSG_DEF(JSMSG_CURLY_AFTER_FINALLY,     0, JSEXN_SYNTAXERR, "missing } after finally block")
MSG_DEF(JSMSG_CURLY_AFTER_LET,         0, JSEXN_SYNTAXERR, "missing } after let block")
MSG_DEF(JSMSG_CURLY_AFTER_LIST,        0, JSEXN_SYNTAXERR, "missing } after property list")
MSG_DEF(JSMSG_CURLY_AFTER_TRY,         0, JSEXN_SYNTAXERR, "missing } after try block")
MSG_DEF(JSMSG_CURLY_BEFORE_BODY,       0, JSEXN_SYNTAXERR, "missing { before function body")
MSG_DEF(JSMSG_CURLY_BEFORE_CATCH,      0, JSEXN_SYNTAXERR, "missing { before catch block")
MSG_DEF(JSMSG_CURLY_BEFORE_FINALLY,    0, JSEXN_SYNTAXERR, "missing { before finally block")
MSG_DEF(JSMSG_CURLY_BEFORE_SWITCH,     0, JSEXN_SYNTAXERR, "missing { before switch body")
MSG_DEF(JSMSG_CURLY_BEFORE_TRY,        0, JSEXN_SYNTAXERR, "missing { before try block")
MSG_DEF(JSMSG_CURLY_IN_COMPOUND,       0, JSEXN_SYNTAXERR, "missing } in compound statement")
MSG_DEF(JSMSG_DECLARATION_AFTER_EXPORT,0, JSEXN_SYNTAXERR, "missing declaration after 'export' keyword")
MSG_DEF(JSMSG_DECLARATION_AFTER_IMPORT,0, JSEXN_SYNTAXERR, "missing declaration after 'import' keyword")
MSG_DEF(JSMSG_DEPRECATED_DELETE_OPERAND, 0, JSEXN_SYNTAXERR, "applying the 'delete' operator to an unqualified name is deprecated")
MSG_DEF(JSMSG_DEPRECATED_OCTAL,        0, JSEXN_SYNTAXERR, "octal literals and octal escape sequences are deprecated")
MSG_DEF(JSMSG_DEPRECATED_PRAGMA,       1, JSEXN_NONE, "Using //@ to indicate {0} pragmas is deprecated. Use //# instead")
MSG_DEF(JSMSG_DUPLICATE_FORMAL,        1, JSEXN_SYNTAXERR, "duplicate formal argument {0}")
MSG_DEF(JSMSG_DUPLICATE_LABEL,         0, JSEXN_SYNTAXERR, "duplicate label")
MSG_DEF(JSMSG_DUPLICATE_PROPERTY,      1, JSEXN_SYNTAXERR, "property name {0} appears more than once in object literal")
MSG_DEF(JSMSG_EMPTY_CONSEQUENT,        0, JSEXN_SYNTAXERR, "mistyped ; after conditional?")
MSG_DEF(JSMSG_EQUAL_AS_ASSIGN,         0, JSEXN_SYNTAXERR, "test for equality (==) mistyped as assignment (=)?")
MSG_DEF(JSMSG_EXPORT_DECL_AT_TOP_LEVEL,0, JSEXN_SYNTAXERR, "export declarations may only appear at top level")
MSG_DEF(JSMSG_FINALLY_WITHOUT_TRY,     0, JSEXN_SYNTAXERR, "finally without try")
MSG_DEF(JSMSG_FROM_AFTER_IMPORT_SPEC_SET, 0, JSEXN_SYNTAXERR, "missing keyword 'from' after import specifier set")
MSG_DEF(JSMSG_GARBAGE_AFTER_INPUT,     2, JSEXN_SYNTAXERR, "unexpected garbage after {0}, starting with {1}")
MSG_DEF(JSMSG_IDSTART_AFTER_NUMBER,    0, JSEXN_SYNTAXERR, "identifier starts immediately after numeric literal")
MSG_DEF(JSMSG_ILLEGAL_CHARACTER,       0, JSEXN_SYNTAXERR, "illegal character")
MSG_DEF(JSMSG_IMPORT_DECL_AT_TOP_LEVEL, 0, JSEXN_SYNTAXERR, "import declarations may only appear at top level")
MSG_DEF(JSMSG_INVALID_FOR_IN_INIT,     0, JSEXN_SYNTAXERR, "for-in loop let declaration may not have an initializer")
MSG_DEF(JSMSG_INVALID_FOR_OF_INIT,     0, JSEXN_SYNTAXERR, "for-of loop variable declaration may not have an initializer")
MSG_DEF(JSMSG_IN_AFTER_FOR_NAME,       0, JSEXN_SYNTAXERR, "missing 'in' or 'of' after for")
MSG_DEF(JSMSG_LABEL_NOT_FOUND,         0, JSEXN_SYNTAXERR, "label not found")
MSG_DEF(JSMSG_LET_COMP_BINDING,        0, JSEXN_SYNTAXERR, "'let' is not a valid name for a comprehension variable")
MSG_DEF(JSMSG_LEXICAL_DECL_NOT_IN_BLOCK,   1, JSEXN_SYNTAXERR, "{0} declaration not directly within block")
MSG_DEF(JSMSG_LINE_BREAK_AFTER_THROW,  0, JSEXN_SYNTAXERR, "no line break is allowed between 'throw' and its expression")
MSG_DEF(JSMSG_MALFORMED_ESCAPE,        1, JSEXN_SYNTAXERR, "malformed {0} character escape sequence")
MSG_DEF(JSMSG_MISSING_BINARY_DIGITS,   0, JSEXN_SYNTAXERR, "missing binary digits after '0b'")
MSG_DEF(JSMSG_MISSING_EXPONENT,        0, JSEXN_SYNTAXERR, "missing exponent")
MSG_DEF(JSMSG_MISSING_EXPR_AFTER_THROW,0, JSEXN_SYNTAXERR, "throw statement is missing an expression")
MSG_DEF(JSMSG_MISSING_FORMAL,          0, JSEXN_SYNTAXERR, "missing formal parameter")
MSG_DEF(JSMSG_MISSING_HEXDIGITS,       0, JSEXN_SYNTAXERR, "missing hexadecimal digits after '0x'")
MSG_DEF(JSMSG_MISSING_OCTAL_DIGITS,    0, JSEXN_SYNTAXERR, "missing octal digits after '0o'")
MSG_DEF(JSMSG_MODULES_NOT_IMPLEMENTED, 0, JSEXN_SYNTAXERR, "modules are not implemented yet")
MSG_DEF(JSMSG_MODULE_SPEC_AFTER_FROM,  0, JSEXN_SYNTAXERR, "missing module specifier after 'from' keyword")
MSG_DEF(JSMSG_NAME_AFTER_DOT,          0, JSEXN_SYNTAXERR, "missing name after . operator")
MSG_DEF(JSMSG_NONDEFAULT_FORMAL_AFTER_DEFAULT, 0, JSEXN_SYNTAXERR, "parameter(s) with default followed by parameter without default")
MSG_DEF(JSMSG_NO_BINDING_NAME,        0, JSEXN_SYNTAXERR, "missing binding name")
MSG_DEF(JSMSG_NO_EXPORT_NAME,          0, JSEXN_SYNTAXERR, "missing export name")
MSG_DEF(JSMSG_NO_IMPORT_NAME,          0, JSEXN_SYNTAXERR, "missing import name")
MSG_DEF(JSMSG_NO_VARIABLE_NAME,        0, JSEXN_SYNTAXERR, "missing variable name")
MSG_DEF(JSMSG_OF_AFTER_FOR_NAME,       0, JSEXN_SYNTAXERR, "missing 'of' after for")
MSG_DEF(JSMSG_PAREN_AFTER_ARGS,        0, JSEXN_SYNTAXERR, "missing ) after argument list")
MSG_DEF(JSMSG_PAREN_AFTER_CATCH,       0, JSEXN_SYNTAXERR, "missing ) after catch")
MSG_DEF(JSMSG_PAREN_AFTER_COND,        0, JSEXN_SYNTAXERR, "missing ) after condition")
MSG_DEF(JSMSG_PAREN_AFTER_FOR,         0, JSEXN_SYNTAXERR, "missing ( after for")
MSG_DEF(JSMSG_PAREN_AFTER_FORMAL,      0, JSEXN_SYNTAXERR, "missing ) after formal parameters")
MSG_DEF(JSMSG_PAREN_AFTER_FOR_CTRL,    0, JSEXN_SYNTAXERR, "missing ) after for-loop control")
MSG_DEF(JSMSG_PAREN_AFTER_FOR_OF_ITERABLE, 0, JSEXN_SYNTAXERR, "missing ) after for-of iterable")
MSG_DEF(JSMSG_PAREN_AFTER_LET,         0, JSEXN_SYNTAXERR, "missing ) after let head")
MSG_DEF(JSMSG_PAREN_AFTER_SWITCH,      0, JSEXN_SYNTAXERR, "missing ) after switch expression")
MSG_DEF(JSMSG_PAREN_AFTER_WITH,        0, JSEXN_SYNTAXERR, "missing ) after with-statement object")
MSG_DEF(JSMSG_PAREN_BEFORE_CATCH,      0, JSEXN_SYNTAXERR, "missing ( before catch")
MSG_DEF(JSMSG_PAREN_BEFORE_COND,       0, JSEXN_SYNTAXERR, "missing ( before condition")
MSG_DEF(JSMSG_PAREN_BEFORE_FORMAL,     0, JSEXN_SYNTAXERR, "missing ( before formal parameters")
MSG_DEF(JSMSG_PAREN_BEFORE_LET,        0, JSEXN_SYNTAXERR, "missing ( before let head")
MSG_DEF(JSMSG_PAREN_BEFORE_SWITCH,     0, JSEXN_SYNTAXERR, "missing ( before switch expression")
MSG_DEF(JSMSG_PAREN_BEFORE_WITH,       0, JSEXN_SYNTAXERR, "missing ( before with-statement object")
MSG_DEF(JSMSG_PAREN_IN_PAREN,          0, JSEXN_SYNTAXERR, "missing ) in parenthetical")
MSG_DEF(JSMSG_RC_AFTER_EXPORT_SPEC_LIST, 0, JSEXN_SYNTAXERR, "missing '}' after export specifier list")
MSG_DEF(JSMSG_RC_AFTER_IMPORT_SPEC_LIST, 0, JSEXN_SYNTAXERR, "missing '}' after module specifier list")
MSG_DEF(JSMSG_REDECLARED_CATCH_IDENTIFIER, 1, JSEXN_TYPEERR, "redeclaration of identifier '{0}' in catch")
MSG_DEF(JSMSG_REDECLARED_PARAM,        1, JSEXN_TYPEERR, "redeclaration of formal parameter {0}")
MSG_DEF(JSMSG_RESERVED_ID,             1, JSEXN_SYNTAXERR, "{0} is a reserved identifier")
MSG_DEF(JSMSG_REST_WITH_DEFAULT,       0, JSEXN_SYNTAXERR, "rest parameter may not have a default")
MSG_DEF(JSMSG_SELFHOSTED_TOP_LEVEL_LEXICAL, 1, JSEXN_SYNTAXERR, "self-hosted code cannot contain top-level {0} declarations")
MSG_DEF(JSMSG_SELFHOSTED_UNBOUND_NAME, 0, JSEXN_TYPEERR, "self-hosted code may not contain unbound name lookups")
MSG_DEF(JSMSG_SEMI_AFTER_FOR_COND,     0, JSEXN_SYNTAXERR, "missing ; after for-loop condition")
MSG_DEF(JSMSG_SEMI_AFTER_FOR_INIT,     0, JSEXN_SYNTAXERR, "missing ; after for-loop initializer")
MSG_DEF(JSMSG_SEMI_BEFORE_STMNT,       0, JSEXN_SYNTAXERR, "missing ; before statement")
MSG_DEF(JSMSG_SOURCE_TOO_LONG,         0, JSEXN_RANGEERR, "source is too long")
MSG_DEF(JSMSG_STRICT_CODE_LET_EXPR_STMT, 0, JSEXN_ERR, "strict mode code may not contain unparenthesized let expression statements")
MSG_DEF(JSMSG_STRICT_CODE_WITH,        0, JSEXN_SYNTAXERR, "strict mode code may not contain 'with' statements")
MSG_DEF(JSMSG_STRICT_FUNCTION_STATEMENT, 0, JSEXN_SYNTAXERR, "in strict mode code, functions may be declared only at top level or immediately within another function")
MSG_DEF(JSMSG_TEMPLSTR_UNTERM_EXPR,    0, JSEXN_SYNTAXERR, "missing } in template string")
MSG_DEF(JSMSG_SIMD_NOT_A_VECTOR,       0, JSEXN_TYPEERR, "value isn't a SIMD value object")
MSG_DEF(JSMSG_TOO_MANY_CASES,          0, JSEXN_INTERNALERR, "too many switch cases")
MSG_DEF(JSMSG_TOO_MANY_CATCH_VARS,     0, JSEXN_SYNTAXERR, "too many catch variables")
MSG_DEF(JSMSG_TOO_MANY_CON_ARGS,       0, JSEXN_SYNTAXERR, "too many constructor arguments")
MSG_DEF(JSMSG_TOO_MANY_DEFAULTS,       0, JSEXN_SYNTAXERR, "more than one switch default")
MSG_DEF(JSMSG_TOO_MANY_FUN_ARGS,       0, JSEXN_SYNTAXERR, "too many function arguments")
MSG_DEF(JSMSG_TOO_MANY_LOCALS,         0, JSEXN_SYNTAXERR, "too many local variables")
MSG_DEF(JSMSG_TOO_MANY_YIELDS,         0, JSEXN_SYNTAXERR, "too many yield expressions")
MSG_DEF(JSMSG_TOUGH_BREAK,             0, JSEXN_SYNTAXERR, "unlabeled break must be inside loop or switch")
MSG_DEF(JSMSG_UNEXPECTED_TOKEN,        2, JSEXN_SYNTAXERR, "expected {0}, got {1}")
MSG_DEF(JSMSG_UNNAMED_FUNCTION_STMT,   0, JSEXN_SYNTAXERR, "function statement requires a name")
MSG_DEF(JSMSG_UNTERMINATED_COMMENT,    0, JSEXN_SYNTAXERR, "unterminated comment")
MSG_DEF(JSMSG_UNTERMINATED_REGEXP,     0, JSEXN_SYNTAXERR, "unterminated regular expression literal")
MSG_DEF(JSMSG_UNTERMINATED_STRING,     0, JSEXN_SYNTAXERR, "unterminated string literal")
MSG_DEF(JSMSG_USELESS_EXPR,            0, JSEXN_TYPEERR, "useless expression")
MSG_DEF(JSMSG_USE_ASM_DIRECTIVE_FAIL,  0, JSEXN_SYNTAXERR, "\"use asm\" is only meaningful in the Directive Prologue of a function body")
MSG_DEF(JSMSG_VAR_HIDES_ARG,           1, JSEXN_TYPEERR, "variable {0} redeclares argument")
MSG_DEF(JSMSG_WHILE_AFTER_DO,          0, JSEXN_SYNTAXERR, "missing while after do-loop body")
MSG_DEF(JSMSG_YIELD_IN_ARROW,          0, JSEXN_SYNTAXERR, "arrow function may not contain yield")
MSG_DEF(JSMSG_YIELD_IN_DEFAULT,        0, JSEXN_SYNTAXERR, "yield in default expression")

// asm.js
MSG_DEF(JSMSG_USE_ASM_TYPE_FAIL,       1, JSEXN_TYPEERR, "asm.js type error: {0}")
MSG_DEF(JSMSG_USE_ASM_LINK_FAIL,       1, JSEXN_TYPEERR, "asm.js link error: {0}")
MSG_DEF(JSMSG_USE_ASM_TYPE_OK,         1, JSEXN_NONE,    "Successfully compiled asm.js code ({0})")

// Proxy
MSG_DEF(JSMSG_BAD_TRAP_RETURN_VALUE,   2, JSEXN_TYPEERR,"trap {1} for {0} returned a primitive value")
MSG_DEF(JSMSG_CANT_CHANGE_EXTENSIBILITY, 0, JSEXN_TYPEERR, "can't change object's extensibility")
MSG_DEF(JSMSG_CANT_DEFINE_INVALID,     0, JSEXN_TYPEERR, "proxy can't define an incompatible property descriptor")
MSG_DEF(JSMSG_CANT_DEFINE_NEW,         0, JSEXN_TYPEERR, "proxy can't define a new property on a non-extensible object")
MSG_DEF(JSMSG_CANT_DEFINE_NE_AS_NC,    0, JSEXN_TYPEERR, "proxy can't define a non-existent property as non-configurable")
MSG_DEF(JSMSG_CANT_REPORT_AS_NON_EXTENSIBLE, 0, JSEXN_TYPEERR, "proxy can't report an extensible object as non-extensible")
MSG_DEF(JSMSG_CANT_REPORT_C_AS_NC,     0, JSEXN_TYPEERR, "proxy can't report existing configurable property as non-configurable")
MSG_DEF(JSMSG_CANT_REPORT_E_AS_NE,     0, JSEXN_TYPEERR, "proxy can't report an existing own property as non-existent on a non-extensible object")
MSG_DEF(JSMSG_CANT_REPORT_INVALID,     0, JSEXN_TYPEERR, "proxy can't report an incompatible property descriptor")
MSG_DEF(JSMSG_CANT_REPORT_NC_AS_NE,    0, JSEXN_TYPEERR, "proxy can't report a non-configurable own property as non-existent")
MSG_DEF(JSMSG_CANT_REPORT_NEW,         0, JSEXN_TYPEERR, "proxy can't report a new property on a non-extensible object")
MSG_DEF(JSMSG_CANT_REPORT_NE_AS_NC,    0, JSEXN_TYPEERR, "proxy can't report a non-existent property as non-configurable")
MSG_DEF(JSMSG_CANT_SET_NW_NC,          0, JSEXN_TYPEERR, "proxy can't successfully set a non-writable, non-configurable property")
MSG_DEF(JSMSG_CANT_SET_WO_SETTER,      0, JSEXN_TYPEERR, "proxy can't succesfully set an accessor property without a setter")
MSG_DEF(JSMSG_CANT_SKIP_NC,            0, JSEXN_TYPEERR, "proxy can't skip a non-configurable property")
MSG_DEF(JSMSG_INVALID_TRAP_RESULT,     2, JSEXN_TYPEERR, "trap {1} for {0} returned an invalid result")
MSG_DEF(JSMSG_MUST_REPORT_SAME_VALUE,  0, JSEXN_TYPEERR, "proxy must report the same value for a non-writable, non-configurable property")
MSG_DEF(JSMSG_MUST_REPORT_UNDEFINED,   0, JSEXN_TYPEERR, "proxy must report undefined for a non-configurable accessor property without a getter")
MSG_DEF(JSMSG_OBJECT_ACCESS_DENIED,    0, JSEXN_ERR, "Permission denied to access object")
MSG_DEF(JSMSG_PROPERTY_ACCESS_DENIED,  1, JSEXN_ERR, "Permission denied to access property '{0}'")
MSG_DEF(JSMSG_PROXY_CONSTRUCT_OBJECT,  0, JSEXN_TYPEERR, "proxy [[Construct]] must return an object")
MSG_DEF(JSMSG_PROXY_EXTENSIBILITY,     0, JSEXN_TYPEERR, "proxy must report same extensiblitity as target")
MSG_DEF(JSMSG_PROXY_GETOWN_OBJORUNDEF, 0, JSEXN_TYPEERR, "proxy [[GetOwnProperty]] must return an object or undefined")
MSG_DEF(JSMSG_PROXY_REVOKED,           0, JSEXN_TYPEERR, "illegal operation attempted on a revoked proxy")

// Structured cloning
MSG_DEF(JSMSG_SC_BAD_CLONE_VERSION,    0, JSEXN_ERR, "unsupported structured clone version")
MSG_DEF(JSMSG_SC_BAD_SERIALIZED_DATA,  1, JSEXN_INTERNALERR, "bad serialized structured data ({0})")
MSG_DEF(JSMSG_SC_DUP_TRANSFERABLE,     0, JSEXN_TYPEERR, "duplicate transferable for structured clone")
MSG_DEF(JSMSG_SC_NOT_TRANSFERABLE,     0, JSEXN_TYPEERR, "invalid transferable array for structured clone")
MSG_DEF(JSMSG_SC_UNSUPPORTED_TYPE,     0, JSEXN_TYPEERR, "unsupported type for structured data")
MSG_DEF(JSMSG_SC_SHMEM_MUST_TRANSFER,  0, JSEXN_TYPEERR, "SharedArrayBuffer must be explicitly transfered during structured cloning")

// Debugger
MSG_DEF(JSMSG_ASSIGN_FUNCTION_OR_NULL, 1, JSEXN_TYPEERR, "value assigned to {0} must be a function or null")
MSG_DEF(JSMSG_DEBUG_BAD_LINE,          0, JSEXN_TYPEERR, "invalid line number")
MSG_DEF(JSMSG_DEBUG_BAD_OFFSET,        0, JSEXN_TYPEERR, "invalid script offset")
MSG_DEF(JSMSG_DEBUG_BAD_REFERENT,      2, JSEXN_TYPEERR, "{0} does not refer to {1}")
MSG_DEF(JSMSG_DEBUG_BAD_RESUMPTION,    0, JSEXN_TYPEERR, "debugger resumption value must be undefined, {throw: val}, {return: val}, or null")
MSG_DEF(JSMSG_DEBUG_CANT_DEBUG_GLOBAL, 0, JSEXN_ERR, "passing non-debuggable global to addDebuggee")
MSG_DEF(JSMSG_DEBUG_CCW_REQUIRED,      1, JSEXN_TYPEERR, "{0}: argument must be an object from a different compartment")
MSG_DEF(JSMSG_DEBUG_COMPARTMENT_MISMATCH, 2, JSEXN_TYPEERR, "{0}: descriptor .{1} property is an object in a different compartment than the target object")
MSG_DEF(JSMSG_DEBUG_LOOP,              0, JSEXN_TYPEERR, "cannot debug an object in same compartment as debugger or a compartment that is already debugging the debugger")
MSG_DEF(JSMSG_DEBUG_NOT_DEBUGGEE,      2, JSEXN_ERR, "{0} is not a debuggee {1}")
MSG_DEF(JSMSG_DEBUG_NOT_DEBUGGING,     0, JSEXN_ERR, "can't set breakpoint: script global is not a debuggee")
MSG_DEF(JSMSG_DEBUG_NOT_IDLE,          0, JSEXN_ERR, "can't start debugging: a debuggee script is on the stack")
MSG_DEF(JSMSG_DEBUG_NOT_LIVE,          1, JSEXN_ERR, "{0} is not live")
MSG_DEF(JSMSG_DEBUG_NO_SCOPE_OBJECT,   0, JSEXN_TYPEERR, "declarative Environments don't have binding objects")
MSG_DEF(JSMSG_DEBUG_OBJECT_PROTO,      0, JSEXN_TYPEERR, "Debugger.Object.prototype is not a valid Debugger.Object")
MSG_DEF(JSMSG_DEBUG_OBJECT_WRONG_OWNER,0, JSEXN_TYPEERR, "Debugger.Object belongs to a different Debugger")
MSG_DEF(JSMSG_DEBUG_OPTIMIZED_OUT,     0, JSEXN_ERR, "variable has been optimized out")
MSG_DEF(JSMSG_DEBUG_RESUMPTION_VALUE_DISALLOWED, 0, JSEXN_TYPEERR, "resumption values are disallowed in this hook")
MSG_DEF(JSMSG_DEBUG_VARIABLE_NOT_FOUND,0, JSEXN_TYPEERR, "variable not found in environment")
MSG_DEF(JSMSG_DEBUG_WRAPPER_IN_WAY,    3, JSEXN_TYPEERR, "{0} is {1}{2}a global object, but a direct reference is required")
MSG_DEF(JSMSG_NOT_CALLABLE_OR_UNDEFINED, 0, JSEXN_TYPEERR, "value is not a function or undefined")
MSG_DEF(JSMSG_NOT_TRACKING_ALLOCATIONS, 1, JSEXN_ERR, "Cannot call {0} without setting trackingAllocationSites to true")
MSG_DEF(JSMSG_OBJECT_METADATA_CALLBACK_ALREADY_SET, 0, JSEXN_ERR, "Cannot track object allocation, because other tools are already doing so")
MSG_DEF(JSMSG_QUERY_INNERMOST_WITHOUT_LINE_URL, 0, JSEXN_TYPEERR, "findScripts query object with 'innermost' property must have 'line' and either 'displayURL', 'url', or 'source'")
MSG_DEF(JSMSG_QUERY_LINE_WITHOUT_URL, 0, JSEXN_TYPEERR, "findScripts query object has 'line' property, but no 'displayURL', 'url', or 'source' property")

// Intl
MSG_DEF(JSMSG_DATE_NOT_FINITE,         0, JSEXN_RANGEERR, "date value is not finite in DateTimeFormat.format()")
MSG_DEF(JSMSG_INTERNAL_INTL_ERROR,     0, JSEXN_ERR, "internal error while computing Intl data")
MSG_DEF(JSMSG_INTL_OBJECT_NOT_INITED,  3, JSEXN_TYPEERR, "Intl.{0}.prototype.{1} called on value that's not an object initialized as a {2}")
MSG_DEF(JSMSG_INTL_OBJECT_REINITED,    0, JSEXN_TYPEERR, "can't initialize object twice as an object of an Intl constructor")
MSG_DEF(JSMSG_INVALID_CURRENCY_CODE,   1, JSEXN_RANGEERR, "invalid currency code in NumberFormat(): {0}")
MSG_DEF(JSMSG_INVALID_DIGITS_VALUE,    1, JSEXN_RANGEERR, "invalid digits value: {0}")
MSG_DEF(JSMSG_INVALID_LANGUAGE_TAG,    1, JSEXN_RANGEERR, "invalid language tag: {0}")
MSG_DEF(JSMSG_INVALID_LOCALES_ELEMENT, 0, JSEXN_TYPEERR, "invalid element in locales argument")
MSG_DEF(JSMSG_INVALID_LOCALE_MATCHER,  1, JSEXN_RANGEERR, "invalid locale matcher in supportedLocalesOf(): {0}")
MSG_DEF(JSMSG_INVALID_OPTION_VALUE,    2, JSEXN_RANGEERR, "invalid value {1} for option {0}")
MSG_DEF(JSMSG_INVALID_TIME_ZONE,       1, JSEXN_RANGEERR, "invalid time zone in DateTimeFormat(): {0}")
MSG_DEF(JSMSG_UNDEFINED_CURRENCY,      0, JSEXN_TYPEERR, "undefined currency in NumberFormat() with currency style")

// RegExp
MSG_DEF(JSMSG_BAD_CLASS_RANGE,         0, JSEXN_SYNTAXERR, "invalid range in character class")
MSG_DEF(JSMSG_ESCAPE_AT_END_OF_REGEXP, 0, JSEXN_SYNTAXERR, "\\ at end of pattern")
MSG_DEF(JSMSG_INVALID_GROUP,           0, JSEXN_SYNTAXERR, "invalid regexp group")
MSG_DEF(JSMSG_MISSING_PAREN,           0, JSEXN_SYNTAXERR, "unterminated parenthetical")
MSG_DEF(JSMSG_NEWREGEXP_FLAGGED,       0, JSEXN_TYPEERR, "can't supply flags when constructing one RegExp from another")
MSG_DEF(JSMSG_NOTHING_TO_REPEAT,       0, JSEXN_SYNTAXERR, "nothing to repeat")
MSG_DEF(JSMSG_NUMBERS_OUT_OF_ORDER,    0, JSEXN_SYNTAXERR, "numbers out of order in {} quantifier.")
MSG_DEF(JSMSG_TOO_MANY_PARENS,         0, JSEXN_INTERNALERR, "too many parentheses in regular expression")
MSG_DEF(JSMSG_UNMATCHED_RIGHT_PAREN,   0, JSEXN_SYNTAXERR, "unmatched ) in regular expression")
MSG_DEF(JSMSG_UNTERM_CLASS,            0, JSEXN_SYNTAXERR, "unterminated character class")

// Self-hosting
MSG_DEF(JSMSG_DEFAULT_LOCALE_ERROR,    0, JSEXN_ERR, "internal error getting the default locale")
MSG_DEF(JSMSG_NO_SUCH_SELF_HOSTED_PROP,1, JSEXN_ERR, "No such property on self-hosted object: {0}")

// Typed object
MSG_DEF(JSMSG_INVALID_PROTOTYPE,       0, JSEXN_TYPEERR, "prototype field is not an object")
MSG_DEF(JSMSG_TYPEDOBJECT_ARRAYTYPE_BAD_ARGS, 0, JSEXN_ERR, "Invalid arguments")
MSG_DEF(JSMSG_TYPEDOBJECT_BAD_ARGS,    0, JSEXN_TYPEERR, "invalid arguments")
MSG_DEF(JSMSG_TYPEDOBJECT_BINARYARRAY_BAD_INDEX, 0, JSEXN_RANGEERR, "invalid or out-of-range index")
MSG_DEF(JSMSG_TYPEDOBJECT_HANDLE_UNATTACHED, 0, JSEXN_TYPEERR, "handle unattached")
MSG_DEF(JSMSG_TYPEDOBJECT_STRUCTTYPE_BAD_ARGS, 0, JSEXN_RANGEERR, "invalid field descriptor")
MSG_DEF(JSMSG_TYPEDOBJECT_TOO_BIG,     0, JSEXN_ERR, "Type is too large to allocate")

// Typed array
MSG_DEF(JSMSG_BAD_INDEX,               0, JSEXN_RANGEERR, "invalid or out-of-range index")
MSG_DEF(JSMSG_TYPED_ARRAY_BAD_ARGS,    0, JSEXN_TYPEERR, "invalid arguments")
MSG_DEF(JSMSG_TYPED_ARRAY_BAD_OBJECT,  0, JSEXN_TYPEERR, "invalid object argument")
MSG_DEF(JSMSG_TYPED_ARRAY_BAD_INDEX,   0, JSEXN_ERR, "invalid or out-of-range index")
MSG_DEF(JSMSG_TYPED_ARRAY_NEGATIVE_ARG,1, JSEXN_ERR, "argument {0} must be >= 0")
MSG_DEF(JSMSG_TYPED_ARRAY_DETACHED,    0, JSEXN_TYPEERR, "attempting to access detached ArrayBuffer")

// Shared array buffer
MSG_DEF(JSMSG_SHARED_ARRAY_BAD_OBJECT,  0, JSEXN_TYPEERR, "invalid object argument")
MSG_DEF(JSMSG_SHARED_ARRAY_BAD_LENGTH,  0, JSEXN_RANGEERR, "length argument out of range")

// Shared typed array
MSG_DEF(JSMSG_SHARED_TYPED_ARRAY_BAD_OBJECT,  0, JSEXN_TYPEERR, "invalid object argument")
MSG_DEF(JSMSG_SHARED_TYPED_ARRAY_BAD_ARGS,    0, JSEXN_RANGEERR, "bad combination of offset, length, and element size")
MSG_DEF(JSMSG_SHARED_TYPED_ARRAY_ARG_RANGE,   1, JSEXN_RANGEERR, "argument {0} out of range")
MSG_DEF(JSMSG_SHARED_TYPED_ARRAY_BAD_LENGTH,  0, JSEXN_TYPEERR, "length argument must not be an object")

// Parallel array
MSG_DEF(JSMSG_PAR_ARRAY_BAD_ARG,       0, JSEXN_RANGEERR, "invalid parallel method argument")
MSG_DEF(JSMSG_PAR_ARRAY_SCATTER_BAD_TARGET, 1, JSEXN_ERR, "target for index {0} is not an integer")
MSG_DEF(JSMSG_PAR_ARRAY_SCATTER_BOUNDS,0, JSEXN_ERR, "index in scatter vector out of bounds")
MSG_DEF(JSMSG_PAR_ARRAY_SCATTER_CONFLICT, 0, JSEXN_ERR, "no conflict resolution function provided")

// Reflect
MSG_DEF(JSMSG_BAD_PARSE_NODE,          0, JSEXN_INTERNALERR, "bad parse node")

// Symbol
MSG_DEF(JSMSG_BAD_SYMBOL,              1, JSEXN_TYPEERR, "{0} is not a well-known @@-symbol")
MSG_DEF(JSMSG_SYMBOL_TO_STRING,        0, JSEXN_TYPEERR, "can't convert symbol to string")
MSG_DEF(JSMSG_SYMBOL_TO_NUMBER,        0, JSEXN_TYPEERR, "can't convert symbol to number")

// Atomics and futexes
MSG_DEF(JSMSG_ATOMICS_NOT_INSTALLED,     0, JSEXN_ERR, "futex support is not installed")
MSG_DEF(JSMSG_ATOMICS_BAD_ARRAY,         0, JSEXN_TYPEERR, "invalid array type for the operation")
MSG_DEF(JSMSG_ATOMICS_TOO_LONG,          0, JSEXN_RANGEERR, "timeout value too large")
