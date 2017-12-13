'use strict'

var { schema } = require('normalizr')

/**
 * Returns a boolean denoting whether `test` is a string.
 * @param {*} test
 */
function isString (test) {
  return typeof test === 'string'
}

/**
 * Returns a boolean denoting whether `test` is an object.
 */
function isObject (test) {
  return typeof test === 'object'
}

function isNormalizrSchema (test) {
  return (
    test instanceof Object ||
    test instanceof schema.Array ||
    test instanceof schema.Entity ||
    test instanceof schema.Object ||
    test instanceof schema.Union ||
    test instanceof schema.Values
  )
}

/**
 * Returns a boolean denoting whether `test` is an boolean.
 */
function isBoolean (test) {
  return typeof test === 'boolean'
}

function isError (test) {
  return test instanceof Error
}

/**
 * Throws a TypeError with a correctly formatted error message.
 * @param {*} target - thing being tested
 * @param {string} expectedType - expected type
 * @param {boolean} strict - if this is false then `false` is returned instead
 * of an error
 */
function makeTypeError (target, expectedType, strict = true) {
  if (strict) {
    throw new TypeError(`${target} must be of type ${expectedType}, but got type ${typeof target}`)
  } else {
    return false
  }
}

/**
 * Checks `test` is a valid type.
 * Throws a TypeError if `test` is not valid.
 * @param {*} test
 */
function validateType (test, strict = true) {
  return isString(test) || makeTypeError(test, 'string', strict)
}

/**
 * Checks `test` is a valid type.
 * Throws a TypeError if `test` is invalid.
 * @param {*} test
 */
function validateDataObject (test, strict = true) {
  return isObject(test) || makeTypeError(test, 'object', strict)
}

/**
 * Checks `test` is a valid normalizr entity.
 * Throws a TypeError if `test` is invalid.
 */
function validateNormalizrEntity (test, strict = true) {
  return isNormalizrSchema(test) || makeTypeError(test, 'schema.*', strict)
}

/**
 * Checks `test` is a valid Error.
 * Throws a TypeError is `test` is invalid.
 * @param {*} test
 * @param {boolean} strict
 */
function validateError (test, strict = true) {
  return isError(test) || makeTypeError(test, 'Error', strict)
}

module.exports = {
  validateType,
  validateDataObject,
  validateNormalizrEntity,
  validateError
}
