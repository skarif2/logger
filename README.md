# logger 🌱

[![Build Status](https://travis-ci.com/skarif2/logger.svg?branch=master)](https://travis-ci.com/skarif2/logger)
[![dependencies Status](https://david-dm.org/skarif2/logger/status.svg)](https://david-dm.org/skarif2/logger)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a0c31825e520752692b/maintainability)](https://codeclimate.com/github/skarif2/logger/maintainability)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://img.shields.io/badge/license-MIT-brightgreen.svg)

Logger is a express middleware that can be used to log request details to the console

**Note:** One must use a parser (ie: [body-parser](https://www.npmjs.com/package/body-parser)) before using logger.

## Usages

### ✔ *Enable logger for all requests*
```
var express = require('express')
var logger = require('@skarif2/logger)
var app = express()

app.use(express.json())

app.use(logger())

app.get('/', function (req, res) {
  res.json({
    msg: 'Beautiful log in the console!'
  })
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
```

### ✔ *Enable logger for a single route*
```
var express = require('express')
var logger = require('@skarif2/logger)
var app = express()

app.use(express.json())

app.get('/', logger(), function (req, res) {
  res.json({
    msg: 'Beautiful log in the console!'
  })
})

app.get('/no-log', function (req, res) {
  res.json({
    msg: 'Without any logging!'
  })
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
```
