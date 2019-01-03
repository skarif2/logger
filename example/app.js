var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var port = 3000
var logger = require('..')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger())

app.get('/', function (req, res) {
  res.send('OK')
})
app.post('/', function (req, res) {
  res.json({
    status: 'success',
    message: 'it was a success'
  })
})
app.put('/', function (req, res, next) {
  var err = new Error('Something went wrong!')
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack
  })
  next()
})

app.listen(port)