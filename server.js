'use strict'

const app = require('./src/app')
const {
  app: { port },
} = require('./src/configs')

const server = app.listen(port, () => {
  console.log(`Server start at ${port}`)
})
