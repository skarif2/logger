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
const consola = require('consola')
const onFinished = require('on-finished')

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
    const response = res.app.response.send
    res.app.response.send = function send(body) {
      response.call(this, body)
      if (body) {
        try {
          res.body = JSON.parse(body)
        } catch (e) {
          res.body = body
        }
      }
    }
    onFinished(res, function (err, res) {
      if (!err) {
        const diff = process.hrtime(req.startAt)
        const resTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2)
        const reqObj = {
          headers: req.headers || {},
          params: req.params || {},
          query: req.query || {},
          body: req.body || {}
        }
        const resObj = {
          statusCode: res.statusCode
        }
        if (res.body) {
          resObj.body = res.body
        }
        consola.info('req:', reqObj)
        consola.info('res:', resObj)
        if (res.statusCode >= 400 && res.statusCode < 500) {
          consola.warn(resObj.body || res.statusMessage)
        } else if (res.statusCode >= 500) {
          consola.error(resObj.body || res.statusMessage)
        }
        consola.log(`${coloredRequest(res.statusCode, req.httpVersion)} ${
          coloredMethod(req.method)} ${req.originalUrl} - ${
          coloredStatus(res.statusCode)} - ${resTime}ms`)
      }
    })
    next()
  }
}

/**
 * get colored method
 * @private
 */
function coloredMethod (method) {
  return ({
    get: '\x1b[32m',
    head: '\x1b[32m',
    post: '\x1b[33m',
    put: '\x1b[34m',
    delete: '\x1b[31m',
    connect: '\x1b[39m',
    options: '\x1b[36m',
    trace: '\x1b[39m',
    patch: '\x1b[34m'
  }[method.toLowerCase()] || '\x1b[39m')
  + method
  + '\x1b[49m\x1b[39m'
}

/**
 * get http version with background color
 * @private
 */
function coloredRequest (status, httpVersion) {
  return ({
    2: '\x1b[42m',
    3: '\x1b[44m',
    4: '\x1b[43m',
    5: '\x1b[41m'
  }[status / 100 | 0] || '\x1b[49m')
  + '\x1b[30m HTTP/' + httpVersion + ' '
  + '\x1b[49m\x1b[39m'
}

/**
 * get colored status
 * @private
 */
function coloredStatus (status) {
  return ({
    2: '\x1b[32m',
    3: '\x1b[34m',
    4: '\x1b[33m',
    5: '\x1b[31m'
  }[status / 100 | 0] || '\x1b[39m')
  + status
  + '\x1b[39m'
}

/**
 * export requestLogger module
 */
module.exports = requestLogger
