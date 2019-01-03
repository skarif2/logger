/*!
 * logger
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
function logger (req, res, next) {
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
    log(err, req, res)
  })

  next()
}

function log (err, req, res) {
  if (err) {
    consola.warn(err)
    return
  }

  var diff = process.hrtime(req.startAt)
  var time = diff[0] * 1e3 + diff[1] * 1e-6
  res.responseTime = time.toFixed(2)

  var reqObj = {
    headers: req.headers || {},
    params: req.params || {},
    query: req.query || {},
    body: req.body || {}
  }

  var resObj = {
    statusCode: res.statusCode
  }

  if (res.body) {
    resObj.body = res.body
  }

  logObj('req', res.statusCode, reqObj)
  logObj('res', res.statusCode, resObj)
  logError(res)
  logRequest(req, res)
}

/**
 * log object
 * @private
 */
function logObj (type, status, obj) {
  consola.log(coloredSign(status)
    + ' '
    + type
    + ': '
    + util.inspect(obj, {
      colors: true,
      compact: false
    })
  )
}

/**
 * log error
 * @private
 */
function logError (res) {
  var status = res.statusCode / 100 | 0

  if (status < 4) {
    return
  }

  var body = res.body 
    ? res.body
    : res.statusMessage

  if (status === 4) {
    consola.warn(body)
  } else if (status === 5) {
    consola.error(body)
  }
}

/**
 * log error
 * @private
 */
function logRequest (req, res) {
  consola.log(coloredRequest(res.statusCode, req.httpVersion)
    + ' '
    + coloredMethod(req.method)
    + ' '
    + req.originalUrl
    + ' - '
    + coloredStatus(res.statusCode)
    + ' - '
    + res.responseTime
    + ' ms'
  )
}

/**
 * get colored sign
 * @private
 */
function coloredSign (status) {
  return ({
    2: '\x1b[92m',
    3: '\x1b[94m',
    4: '\x1b[93m',
    5: '\x1b[91m'
  }[status / 100 | 0] || '\x1b[39m')
  + '\x1b[1m'
  + '✔'
  + '\x1b[0m'
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
  + '\x1b[0m'
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
  + '\x1b[30m HTTP/'
  + httpVersion
  + ' '
  + '\x1b[0m'
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
  + '\x1b[0m'
}

module.exports = function () {
  return logger
}
