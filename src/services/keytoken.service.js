'use strict'

const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString
      // })

      // return tokens ? publicKeyString : null

      const publicKeyString = publicKey.toString()

      const filter = { user: userId }
      const update = {
        publicKey: publicKeyString,
        refreshTokensUsed: [],
        refreshToken,
      }
      const options = { upsert: true, new: true }

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      )

      return tokens ? publicKeyString : null
    } catch (error) {
      return error
    }
  }

  static removeById = async (id) => {
    return await keytokenModel.findByIdAndDelete(id)
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({user: userId}).lean()
  }
}

module.exports = KeyTokenService
