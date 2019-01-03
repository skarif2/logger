/*!
 * request-logger
 * Copyright(c) 2019 Sk Arif
 * MIT Licensed
 */
var util = require('util')
var consola = require('consola')
var onFinished = require('on-finished')

/**
 * log req and res body with request details
 *
 * @return {Function} middleware
 * @public
 */
function requestLogger () {
  return function requestLogger (req, res, next) {
    req.startAt = process.hrtime()
    var response = res.app.response.send
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
      if (err) {
        consola.warn(err)
        return
      }
      var diff = process.hrtime(req.startAt)
      var resTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2)
      var reqObj = {
        headers: req.headers || {},
        params: req.params || {},
        query: req.query || {},
        body: req.body || {}
      }
      var resObj = { statusCode: res.statusCode }
      if (res.body) {
        resObj.body = res.body
      }
      var utilRules = {
        colors: true,
        compact: false
      }

      consola.log(_sign(res.statusCode)
        + ' req: '
        + util.inspect(reqObj, utilRules)
      )

      consola.log(_sign(res.statusCode)
        + ' res: '
        + util.inspect(resObj, utilRules)
      )

      if ((res.statusCode / 100 | 0) === 4) {
        consola.warn(res.body
          ? res.body
          : res.statusMessage
        )
      } else if ((res.statusCode / 100 | 0) === 5) {
        consola.error(res.body
          ? res.body
          : res.statusMessage
        )
      }

      consola.log(_request(res.statusCode,req.httpVersion)
        + ' '
        + _method(req.method)
        + ' '
        + req.originalUrl
        + ' - '
        + _status(res.statusCode)
        + ' - '
        + resTime
        + ' ms'
      )
    })
    next()
  }
}

/**
 * get colored sign
 * @private
 */
function _sign (status) {
  return ({
    2: '\x1b[92m',
    3: '\x1b[94m',
    4: '\x1b[93m',
    5: '\x1b[91m'
  }[status / 100 | 0] || '\x1b[39m')
  + '\x1b[1m✔\x1b[0m'
}

/**
 * get colored method
 * @private
 */
function _method (method) {
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
  + '\x1b[0m'
}

/**
 * get http version with background color
 * @private
 */
function _request (status, httpVersion) {
  return ({
    2: '\x1b[42m',
    3: '\x1b[44m',
    4: '\x1b[43m',
    5: '\x1b[41m'
  }[status / 100 | 0] || '\x1b[49m')
  + '\x1b[30m HTTP/' + httpVersion + ' '
  + '\x1b[0m'
}

/**
 * get colored status
 * @private
 */
function _status (status) {
  return ({
    2: '\x1b[32m',
    3: '\x1b[34m',
    4: '\x1b[33m',
    5: '\x1b[31m'
  }[status / 100 | 0] || '\x1b[39m')
  + status
  + '\x1b[0m'
}

/**
 * export requestLogger module
 */
module.exports = requestLogger
