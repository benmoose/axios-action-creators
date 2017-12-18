var normalizr = require('normalizr')
var utils = require('../utils')

/**
 * Takes an action type and returns a function, which optionally takes a `meta`
 * parameter, and returns an action of the given type and, if provided, the meta data.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var REQUEST = (type) => (config = {}) => {
  // Validate config and properties
  utils.validateType(type)
  utils.validateDataObject(config)
  config.hasOwnProperty('meta') && utils.validateDataObject(config.meta)
  // Return the action
  return Object.assign({ type }, config.meta && { meta: config.meta })
}

/**
 * Takes an action type and returns a function which takes optional `payload` and
 * `meta` arguments. The second optional argument accepts a `meta` key, which can
 * be used to add arbirary data to the meta key, and `schema`, which should be a
 * normalizr Entity, and is used to normalise the data in the payload.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var SUCCESS = (type) => (response = null, config = {}) => {
  // Validate config and properties
  utils.validateType(type)
  utils.validateDataObject(config)
  response && utils.validateDataObject(response)
  config.hasOwnProperty('meta') && utils.validateDataObject(config.meta)
  config.hasOwnProperty('schema') && utils.validateNormalizrEntity(config.schema)
  // Extract data from response
  var data = response && response.data
  // Get normalized response (if data and schema exists)
  var normalized = data && config.schema && normalizr.normalize(data, config.schema)
  // Return the action
  return Object.assign(
    { type },
    (normalized || data) && { payload: normalized || data },
    (response || config.meta) && { meta: Object.assign({}, config.meta, response && { response }) }
  )
}

/**
 * Takes an action type and returns a function which takes optional `payload` and
 * `meta` arguments. The returned action has the `error` parameter set and the
 * `payload` is an error object.
 * Returned action is formatted as a FSA.
 * @param {string} type - Action type
 */
var FAILURE = (type) => (error = null, config = {}) => {
  // Validate config and properties
  utils.validateType(type)
  utils.validateDataObject(config)
  error && utils.validateError(error)
  config.hasOwnProperty('meta') && utils.validateDataObject(config.meta)
  config.hasOwnProperty('schema') && utils.validateDataObject(config.schema)
  // On failure the response is an error object
  return Object.assign(
    { type, error: true },
    error && { payload: error },
    (config.meta || (error && error.response)) &&
      { meta: Object.assign({}, error && error.response && { response: error.response }, config.meta) }
  )
}

module.exports = { REQUEST, SUCCESS, FAILURE }
