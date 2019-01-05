# logger 🌱

[![NPM Version](https://img.shields.io/npm/v/@skarif2/logger.svg)](https://www.npmjs.com/package/@skarif2/logger)
[![Build Status](https://travis-ci.com/skarif2/logger.svg?branch=master)](https://travis-ci.com/skarif2/logger)
[![dependencies Status](https://david-dm.org/skarif2/logger/status.svg)](https://david-dm.org/skarif2/logger)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a0c31825e520752692b/maintainability)](https://codeclimate.com/github/skarif2/logger/maintainability)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://img.shields.io/badge/license-MIT-brightgreen.svg)

Logger is an [express](http://expressjs.com) middleware that can be used to log request details to the console.

<div align='center'>
  <img src='https://user-images.githubusercontent.com/5141132/50721684-aac76a80-10ed-11e9-8785-43327e845cda.png' alt='Logger'>
</div>

**Note:** A parser (ie: [body-parser](https://www.npmjs.com/package/body-parser))  should be used before initializing logger.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm i @skarif2/logger
```

## Usages

### Enable logger for all requests
```javascript
var express = require('express')
var logger = require('@skarif2/logger')
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

### Enable logger for a single route
```javascript
var express = require('express')
var logger = require('@skarif2/logger')
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
