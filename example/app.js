const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const logger = require('..')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger({}))

app.get('/', (req, res) => res.send('OK'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))