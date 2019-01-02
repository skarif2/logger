/*!
 * request-logger
 * Copyright(c) 2019 Sk Arif
 * MIT Licensed
 */

'use strict'

/**
 * require dependencies
 * @private
 */
var chalk = require('chalk')
var consola = require('consola')
var onFinished = require('on-finished')

/**
 * log req and res body with request details
 *
 * @param {Object} [options]
 * @return {Function} middleware
 * @public
 */
function requestLogger (options) {
  return function requestLogger (req, res, next) {
    req.startAt = process.hrtime()
    var response = res.app.response.send
    res.app.response.send = function send(body) {
      response.call(this, body)
      res.body = body
    }
    onFinished(res, function (err, res) {
      log(err, req, res)
    })
    next()
  }
}

/**
 * log req and res body
 * @private
 */
function log(err, req, res) {
  if (!err) {
    var diff = process.hrtime(req.startAt)
    var resTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2)

    var reqObj = {
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body
    }
    var resObj = {
      statusCode: res.statusCode
    }
    try {
      resObj.body = JSON.parse(res.body)
    } catch (e) {
      resObj.body = res.body
    }

    /**
     * log infornations
     */
    consola.info('req:', reqObj)
    consola.info('res:', resObj)
    if (res.statusCode >= 400 && res.statusCode < 500) {
      consola.warn(resObj.body)
    } else if (res.statusCode >= 500) {
      consola.error(resObj.body)
    }
    consola.log(`${getRequestColor(res.statusCode, req.httpVersion)} ${
      getMethodColor(req.method)} ${req.originalUrl} - ${
      getStatusColor(res.statusCode)} - ${resTime} ms`)
  }
}

/**
 * get colored method name
 * @private
 */
function getMethodColor (method) {
  switch (method) {
    case 'GET':
      return chalk.green.bold('GET')
    case 'POST':
      return chalk.yellow.bold('POST')
    case 'PUT':
      return chalk.blue.bold('PUT')
    case 'PATCH':
      return chalk.blue.bold('PATCH')
    case 'DELETE':
      return chalk.red.bold('DELETE')
    default:
      return chalk.cyan.bold(method)
  }
}

/**
 * get http version with background color
 * @private
 */
function getRequestColor (status, httpVersion) {
  if (status < 300) {
    return chalk.black.bgGreen(` HTTP/${httpVersion} `)
  }
  if (status >= 300 && status < 400) {
    return chalk.black.bgBlue(` HTTP/${httpVersion} `)
  }
  if (status >= 400 && status < 500) {
    return chalk.black.bgYellow(` HTTP/${httpVersion} `)
  }
  return chalk.black.bgRed(` HTTP/${httpVersion} `)
}

/**
 * get colored status
 * @private
 */
function getStatusColor (status) {
  if (status < 300) {
    return chalk.green(status)
  }
  if (status >= 300 && status < 400) {
    return chalk.blue(status)
  }
  if (status >= 400 && status < 500) {
    return chalk.yellow(status)
  }
  return chalk.red(status)
}

/**
 * export requestLogger module
 */
module.exports = requestLogger
