/* globals describe, test, expect */

import axiosActionCreators from '../../src/axiosActionCreators'
import { schema, normalize } from 'normalizr'

const ACTION_TYPE_FOO = 'ACTION_TYPE_FOO'
const user = new schema.Entity('users')

describe('Universal tests', () => {
  test('Request function exists', () => {
    expect(require('../../index').REQUEST).toBeInstanceOf(Function)
    expect(require('../../index').SUCCESS).toBeInstanceOf(Function)
    expect(require('../../index').FAILURE).toBeInstanceOf(Function)
  })

  test('Function is returned when only passed type', () => {
    expect(axiosActionCreators.REQUEST(ACTION_TYPE_FOO)).toBeInstanceOf(Function)
    expect(axiosActionCreators.SUCCESS(ACTION_TYPE_FOO)).toBeInstanceOf(Function)
    expect(axiosActionCreators.FAILURE(ACTION_TYPE_FOO)).toBeInstanceOf(Function)
  })

  test('TypeError is thrown when type is not a string', () => {
    expect(() => axiosActionCreators.REQUEST(5)()).toThrowError(TypeError)
    expect(() => axiosActionCreators.SUCCESS(5)()).toThrowError(TypeError)
    expect(() => axiosActionCreators.FAILURE(5)()).toThrowError(TypeError)
    expect(() => axiosActionCreators.REQUEST({})()).toThrowError(TypeError)
    expect(() => axiosActionCreators.SUCCESS({})()).toThrowError(TypeError)
    expect(() => axiosActionCreators.FAILURE({})()).toThrowError(TypeError)
    expect(() => axiosActionCreators.REQUEST(true)()).toThrowError(TypeError)
    expect(() => axiosActionCreators.SUCCESS(true)()).toThrowError(TypeError)
    expect(() => axiosActionCreators.FAILURE(true)()).toThrowError(TypeError)
  })
})

describe('REQUEST', () => {
  const REQUEST = axiosActionCreators.REQUEST

  test('TypeError is thrown when config is not an object', () => {
    function callWithoutObject () {
      REQUEST(ACTION_TYPE_FOO)(6)
    }
    expect(callWithoutObject).toThrowError(TypeError)
  })

  test('TypeError is thrown when config.meta is not an object', () => {
    function callWithoutObject () {
      REQUEST(ACTION_TYPE_FOO)({ meta: 5 })
    }
    expect(callWithoutObject).toThrowError(TypeError)
  })

  test('Action is output when called twice', () => {
    const expected = { type: ACTION_TYPE_FOO }
    expect(REQUEST(ACTION_TYPE_FOO)()).toEqual(expected)
  })

  test('Action contains meta when given', () => {
    const meta = { foo: 'bar' }
    const expected = { type: ACTION_TYPE_FOO, meta }
    expect(REQUEST(ACTION_TYPE_FOO)({ meta })).toEqual(expected)
  })
})

describe('SUCCESS', () => {
  const SUCCESS = axiosActionCreators.SUCCESS
  const data = [
    { id: 5, name: 'foo' },
    { id: 8, name: 'bar' }
  ]

  test('TypeError thrown when payload is not an object', () => {
    function callWithoutPayloadObject () {
      SUCCESS(ACTION_TYPE_FOO)(5)
    }
    expect(callWithoutPayloadObject).toThrowError(TypeError)
  })

  test('TypeError thrown when config is not an object', () => {
    function callWithInvalidSchema () {
      SUCCESS(ACTION_TYPE_FOO)({}, 'foo')
    }
    expect(callWithInvalidSchema).toThrowError(TypeError)
  })

  test('TypeError thrown when config.meta is not an object', () => {
    function callWithInvalidSchema () {
      SUCCESS(ACTION_TYPE_FOO)({}, { meta: true })
    }
    expect(callWithInvalidSchema).toThrowError(TypeError)
  })

  test('TypeError thrown when config.schema is not an object', () => {
    function callWithInvalidSchema () {
      SUCCESS(ACTION_TYPE_FOO)({}, { schema: 10 })
    }
    expect(callWithInvalidSchema).toThrowError(TypeError)
  })

  test('Action is output when called twice', () => {
    const expected = { type: ACTION_TYPE_FOO }
    expect(SUCCESS(ACTION_TYPE_FOO)()).toEqual(expected)
  })

  test('Action returns response data', () => {
    const response = { data, status: 200, headers: {} }
    const expected = {
      type: ACTION_TYPE_FOO,
      payload: data,
      meta: { response }
    }
    expect(SUCCESS(ACTION_TYPE_FOO)(response)).toEqual(expected)
  })

  test('Action contains no data key when data not present', () => {
    const response = { status: 204, headers: {} }
    const expected = { type: ACTION_TYPE_FOO, meta: { response } }
    expect(SUCCESS(ACTION_TYPE_FOO)(response)).toEqual(expected)
  })

  test('Action contains no meta when neither response or meta given', () => {
    expect(SUCCESS(ACTION_TYPE_FOO)()).not.toHaveProperty('meta')
  })

  test('Action contains meta when either response or meta given', () => {
    const response = { status: 204, headers: {} }
    const meta = { foo: 'bar' }
    expect(SUCCESS(ACTION_TYPE_FOO)(response)).toHaveProperty('meta', { response })
    expect(SUCCESS(ACTION_TYPE_FOO)(null, { meta })).toHaveProperty('meta', meta)
    expect(SUCCESS(ACTION_TYPE_FOO)(response, { meta }))
      .toHaveProperty('meta', Object.assign({ response }, meta))
  })

  test('Action payload contains normalized response when schema given', () => {
    const schema = [ user ]
    const normalized = normalize(data, schema)
    const response = { data, status: 200, headers: {} }
    const expected = { type: ACTION_TYPE_FOO, payload: normalized, meta: { response } }
    expect(SUCCESS(ACTION_TYPE_FOO)(response, { schema })).toEqual(expected)
  })

  test('Action payload contains raw data when no schema given', () => {
    const response = { data, status: 200, headers: {} }
    const expected = { type: ACTION_TYPE_FOO, payload: data, meta: { response } }
    expect(SUCCESS(ACTION_TYPE_FOO)(response)).toEqual(expected)
  })

  test('Action payload contains normalized response when valid but nonsensical schema given', () => {
    const schema = {}
    const normalized = normalize(data, schema)
    const response = { data, status: 200, headers: {} }
    const expected = { type: ACTION_TYPE_FOO, payload: normalized, meta: { response } }
    expect(SUCCESS(ACTION_TYPE_FOO)(response, { schema })).toEqual(expected)
  })
})

describe('FAILURE', () => {
  const FAILURE = axiosActionCreators.FAILURE

  test('TypeError thrown when config is not an object', () => {
    function callWithInvalidConfig () {
      FAILURE(ACTION_TYPE_FOO)(null, false)
    }
    expect(callWithInvalidConfig).toThrowError(TypeError)
  })

  test('TypeError thrown when config.meta is not an object', () => {
    function callWithInvalidConfig () {
      FAILURE(ACTION_TYPE_FOO)({ meta: [] })
    }
    expect(callWithInvalidConfig).toThrowError(TypeError)
  })

  test('TypeError thrown when config.schema is not an object', () => {
    function callWithInvalidConfig () {
      FAILURE(ACTION_TYPE_FOO)({ schema: 'entity' })
    }
    expect(callWithInvalidConfig).toThrowError(TypeError)
  })

  test('Action contains error property', () => {
    expect(FAILURE(ACTION_TYPE_FOO)()).toHaveProperty('error', true)
    expect(FAILURE(ACTION_TYPE_FOO)(new Error())).toHaveProperty('error', true)
    expect(FAILURE(ACTION_TYPE_FOO)(new Error(), { meta: {} })).toHaveProperty('error', true)
  })

  test('Action only contains payload property when error given', () => {
    expect(FAILURE(ACTION_TYPE_FOO)()).not.toHaveProperty('payload')
    expect(FAILURE(ACTION_TYPE_FOO)(new Error())).toHaveProperty('payload')
    expect(FAILURE(ACTION_TYPE_FOO)(new Error(), { foo: 'bar' })).toHaveProperty('payload')
  })

  test('Action payload is always an Error object', () => {
    expect(FAILURE(ACTION_TYPE_FOO)(new Error()).payload).toBeInstanceOf(Error)
    expect(FAILURE(ACTION_TYPE_FOO)(new Error(), { meta: { a: 5 } }).payload).toBeInstanceOf(Error)
  })

  test('Action contains no meta when neither error.response or meta given', () => {
    expect(FAILURE(ACTION_TYPE_FOO)()).not.toHaveProperty('meta')
  })

  test('Action contains meta when either error.response or meta given', () => {
    const err = new Error()
    err.response = { status: 204 }
    const meta = { foo: 'bar' }
    expect(FAILURE(ACTION_TYPE_FOO)(err)).toHaveProperty('meta', { response: err.response })
    expect(FAILURE(ACTION_TYPE_FOO)(err, { meta }))
      .toHaveProperty('meta', Object.assign({ response: err.response }, meta))
  })

  test('Action contains error in payload when response is an error', () => {
    const err = new Error('Request failed with status code 404')
    const expected = {
      type: ACTION_TYPE_FOO,
      error: true,
      payload: err
    }
    expect(FAILURE(ACTION_TYPE_FOO)(err)).toEqual(expected)
  })
})
