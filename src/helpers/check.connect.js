'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECOND = 5000
const _BYTE = 1024

const countConnect = () => {
  const numConnections = mongoose.connections.length

  console.log(`Number of connections:: ${numConnections}`)
}

const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    const maxConnection = numCores * 5

    if (numConnections > maxConnection) {
      console.log(`Connection Overload Detected!`)
    }
  }, _SECOND)
}

module.exports = {
  countConnect,
  checkOverLoad,
}
