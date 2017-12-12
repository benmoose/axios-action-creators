/**
 * Takes an action type and returns a function, which optionally takes a `meta`
 * parameter, and returns an action of the given type and, if provided, the meta data.
 * @param {string} type - Action type
 */
export const REQUEST = (type) => (meta = false) => ({
  type,
  ...meta && { meta }
})

/**
 * Takes an action type and returns a function which takes optional `payload` and
 * `meta` arguments. If `payload` is formatted as an axios response then the `data`
 * parameter is the actions payload and the other payload parameters are added
 * to the `meta` parameter.
 * @param {string} type - Action type
 */
export const SUCCESS = (type) => (payload = {}, meta = false) => {
  const { data, ...rest } = payload
  return data
    ? { type, payload: data, meta: { ...rest, ...meta && { meta } } }
    : { type, payload, ...meta && { meta } }
}

/**
 * Takes an action type and returns a function which takes option `payload` and
 * `meta` arguments. The returned action has the `error` parameter set and the
 * `payload` is an error object.
 * @param {string} type - Action type
 */
export const FAILURE = (type) => (payload = {}, meta = false) => {
  const { response, request, message } = payload
  const action = {
    type,
    error: true,
    ...meta && { meta }
  }

  if (response) {
    // The request was made and the server responsed with a status outside of the
    // 2xx range
    const errorMessage = response.status >= 500
      ? 'There was a server error'
      : response.status >= 400
        ? 'There was an app error'
        : 'An unknown error occurred'
    return {
      ...action,
      meta: { ...action.meta, ...response },
      payload: new Error(errorMessage)
    }
  } else if (request) {
    // The request was made but no response was recieved.
    return { ...action, payload: new Error('There was no response from the server') }
  } else {
    // Something happened in setting up the request that triggered an Error
    return { ...action, payload: new Error(message) }
  }
}
