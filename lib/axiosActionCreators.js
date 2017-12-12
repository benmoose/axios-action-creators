'use strict'

var REQUEST = require('./actionCreators')
var SUCCESS = require('./actionCreators')
var FAILURE = require('./actionCreators')

var AxiosActionCreators = { REQUEST, SUCCESS, FAILURE }

module.exports = AxiosActionCreators

// Allow use of default import syntax in TypeScript
module.exports.default = AxiosActionCreators
