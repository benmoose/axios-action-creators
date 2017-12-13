# Axios Action Creators

**Axios Action Creators** makes it really easy to deal with API responses.
Simply define the action creators and then call them when you receive the response to get [standardised](https://github.com/acdlite/flux-standard-action) actions.

## Usage

###### Basic Usage

```js
import axios from 'axios'
import { REQUEST, SUCCESS, FAILURE } from 'axios-action-creators'
import { user } from './schema'

// (1) Define action types
export const GET_USERS_REQUEST = 'GET_USERS_REQUEST'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE'

// (2) Define action creators – just pass in the type
const getUsersRequest = REQUEST(GET_USERS_REQUEST)
const getUsersSuccess = SUCCESS(GET_USERS_SUCCESS)
const getUsersFailure = FAILURE(GET_USERS_FAILURE)

// (3) Call the action creators to get the actions
export const getUsers = () => (dispatch) => {
  // Resolves to a action with type GET_USERS_REQUEST
  dispatch(getUsersRequest())
  return axios.get('/users')
    // If successful dispatch GET_USERS_SUCCESS action
    .then(res => dispatch(getUsersSuccess(res)))
    // If failure dispatch GET_USERS_FAILURE action
    .catch(err => dispatch(getUsersFailure(err)))
}
```

All action creators optionally take an object which can be used to modify the action.

Valid keys in this object are:
 - `meta` add arbitrary data to a `meta` property in the action.
 - `schema` _(only SUCCESS / FAILURE)_ a [normalizr](https://github.com/paularmstrong/normalizr) schema to normalise the response.

###### Example usage setting `meta` and `schema`

```js
import { schema } from 'normalizr'
const getGistsRequest = SUCCESS('GET_GISTS_REQUEST')
const getGistsSuccess = SUCCESS('GET_GISTS_SUCCESS')

export const getGists = () => dispatch => {
  dispatch(getGistsRequest({
    meta: { requestedAt: Date.now() }
  }))
  axios.get('/username/gists')
    .then(res => dispatch(getGistsSuccess(res, {
      meta: { responseAt: Date.now() },
      schema: new schema.Array('gists')
    })))
}
```

The dispatched actions would look something like this

```js
// getGistsRequest
{
  type: GET_GISTS_REQUEST,
  meta: {
    requestedAt: 1513176647405
  }
}

// getGistsSuccess
{
  type: GET_GISTS_SUCCESS,
  payload: {
    entities: {...},
    result: [15564, 27377, ...]
  },
  meta: {
    responseAt: 1513176648004,
    response: {...}
  },
}
```

The original unmodified response, if available, is always stored in `meta.response`.
Request data, either raw or normalised, is always stored in `payload`.
