'use strict'

const shopModel = require('../models/shop.model')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const KeyTokenService = require('./keytoken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError } = require('../core/error.response')
const { OK, CREATED } = require('../core/success.response')

const _HASH_ROUNDS = 10

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '0001',
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // Check email exist
    const holderShop = await shopModel.findOne({ email }).lean()

    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, _HASH_ROUNDS)

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    })

    // Create PublicKey & PrivateKey
    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      })

      console.log(`Private Key:: ${privateKey}`, `PublicKey ${publicKey}`)

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      })

      if (!publicKeyString) {
        return {
          code: 'xxx',
          message: 'Error!',
        }
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString)

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey,
      )
      console.log(`Create Token Success::`, tokens)

      return {
        shop: getInfoData(newShop, ['_id', 'name', 'email']),
        tokens,
      }
    }

    new OK()
  }
}

module.exports = AccessService
