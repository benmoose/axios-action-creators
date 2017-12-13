'use strict'

var { REQUEST } = require('./core')
var { SUCCESS } = require('./core')
var { FAILURE } = require('./core')

var axiosActionCreators = { REQUEST, SUCCESS, FAILURE }

module.exports = axiosActionCreators
