var normalizr = require('normalizr')
var utils = require('../utils')

/**
 * Takes an action type and returns a function, which optionally takes a `meta`
 * parameter, and returns an action of the given type and, if provided, the meta data.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var REQUEST = (type) => (meta = false) => {
  utils.validateType(type)
  utils.validateDataObject(meta)
  return Object.assign({ type }, meta && { meta })
}

/**
 * Takes an action type and returns a function which takes optional `payload` and
 * `meta` arguments. The second optional argument accepts a `meta` key, which can
 * be used to add arbirary data to the meta key, and `schema`, which should be a
 * normalizr Entity, and is used to normalise the data in the payload.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var SUCCESS = (type) => (response = false, { schema = false, meta = false } = {}) => {
  utils.validateType(type)
  utils.validateDataObject(response)
  utils.validateDataObject(meta)
  schema && utils.validateNormalizrEntity(schema)
  // Extract data from response
  var data = response && response.data
  // Get normalized response (if data and schema exists)
  var payload = data && schema && normalizr.normalize(data, schema)
  // Return the action, only `type` must be in action.
  return Object.assign(
    { type },
    response && { response },
    payload && { payload },
    meta && { meta }
  )
}

/**
 * Takes an action type and returns a function which takes optional `payload` and
 * `meta` arguments. The returned action has the `error` parameter set and the
 * `payload` is an error object.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var FAILURE = (type) => (error = new Error(), { meta = false } = {}) => {
  utils.validateType(type)
  utils.validateError(error)
  // On failure the response is an error object
  return Object.assign(
    { type, error: true, payload: error },
    error.response && { response: error.response },
    meta && { meta }
  )
}

module.exports = { REQUEST, SUCCESS, FAILURE }
