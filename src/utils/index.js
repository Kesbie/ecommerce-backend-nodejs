'use strict'

const _ = require('lodash')

/**
 *  Create an object contain picked object properties
 * 
 * @param {Object} object
 * @param {string | string[]} fields
 * @returns {Object}
 */

const getInfoData = (object, fields) => {
  return _.pick(object, fields)
}

module.exports = {
  getInfoData,
}
