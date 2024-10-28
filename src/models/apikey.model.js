'use strict'

const { Schema, model } = require('mongoose')
const { collection } = require('./shop.model')

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  { timestamps: true, collection: collection },
)

module.exports = model(DOCUMENT_NAME, apiKeySchema)
