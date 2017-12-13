# Axios Action Creators

**Axios Action Creators** makes it easier to work with api responces using axios.

###### Request action

`REQUEST(actionTypes.GET_USER_REQUEST)` gives a function that resolves to the following when dispatched.

```js
{
  type: "GET_USER_REQUEST"
}
```

###### Success action

`SUCCESS(actionTypes.GET_USER_SUCCESS)` gives a function that resolves to the following when dispatched.

```js
{
  type: "GET_USER_SUCCESS",
  payload: {
    id: 5,
    name: "John Doe"
  },
  meta: {
    status: 200,
    ...
  }
}
```

###### Failure action

`FAILURE(actionTypes.GET_USER_FAILURE)` gives a function that resolves to the following when dispatched.

```js
{
  type: "GET_USER_FAILURE",
  error: true,
  payload: {
    message: "Authorization details not provided",
    status: 403,
    ...
  },
  meta: {
    status: 403,
    ...
  }
}
```
