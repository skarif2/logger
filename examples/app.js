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

app.listen(3000)