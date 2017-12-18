'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('normalizr'),
    schema = _require.schema;

/**
 * Returns a boolean denoting whether `test` is a string.
 * @param {*} test
 */


function isString(test) {
  return typeof test === 'string';
}

/**
 * Returns a boolean denoting whether `test` is an object.
 */
function isObject(test) {
  return (typeof test === 'undefined' ? 'undefined' : _typeof(test)) === 'object';
}

function isNormalizrSchema(test) {
  return test instanceof Object || test instanceof schema.Array || test instanceof schema.Entity || test instanceof schema.Object || test instanceof schema.Union || test instanceof schema.Values;
}

/**
 * Returns a boolean denoting whether `test` is an boolean.
 */
function isBoolean(test) {
  return typeof test === 'boolean';
}

function isError(test) {
  return test instanceof Error;
}

/**
 * Throws a TypeError with a correctly formatted error message.
 * @param {*} target - thing being tested
 * @param {string} expectedType - expected type
 * @param {boolean} strict - if this is false then `false` is returned instead
 * of an error
 */
function makeTypeError(target, expectedType) {
  var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (strict) {
    throw new TypeError(target + ' must be of type ' + expectedType + ', but got type ' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)));
  } else {
    return false;
  }
}

/**
 * Checks `test` is a valid type.
 * Throws a TypeError if `test` is not valid.
 * @param {*} test
 */
function validateType(test) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return isString(test) || makeTypeError(test, 'string', strict);
}

/**
 * Checks `test` is a valid type.
 * Throws a TypeError if `test` is invalid.
 * @param {*} test
 */
function validateDataObject(test) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return isObject(test) || makeTypeError(test, 'object', strict);
}

/**
 * Checks `test` is a valid normalizr entity.
 * Throws a TypeError if `test` is invalid.
 */
function validateNormalizrEntity(test) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return isNormalizrSchema(test) || makeTypeError(test, 'schema.*', strict);
}

/**
 * Checks `test` is a valid Error.
 * Throws a TypeError is `test` is invalid.
 * @param {*} test
 * @param {boolean} strict
 */
function validateError(test) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return isError(test) || makeTypeError(test, 'Error', strict);
}

module.exports = {
  validateType: validateType,
  validateDataObject: validateDataObject,
  validateNormalizrEntity: validateNormalizrEntity,
  validateError: validateError
};