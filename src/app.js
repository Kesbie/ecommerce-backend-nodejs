require('dotenv').config()
const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const app = express()

// Init Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

// Init Database
require('./databases/init.mongodb')

// Init Route
app.use('/', require('./routes'))

// Handling Error
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: error.message || '',
  })
})

module.exports = app
