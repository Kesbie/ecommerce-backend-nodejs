'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const KeyTokenService = require('./keytoken.service')
const ShopService = require('./shop.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { OK } = require('../core/success.response')

const _HASH_ROUNDS = 10

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeById(keyStore)

    console.log(delKey)
    return delKey
  }

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop is not registered')

    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication Error')

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

    const { _id: userId } = foundShop

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: userId,
      publicKey,
      privateKey,
    })

    if (!publicKeyString) {
      return {
        code: 'xxx',
        message: 'Error!',
      }
    }

    const publicKeyObject = crypto.createPublicKey(publicKeyString)

    const tokens = await createTokenPair(
      { userId: userId, email },
      publicKeyObject,
      privateKey,
    )

    console.log(`Create Token Success::`, tokens)

    await KeyTokenService.createKeyToken({
      userId,
      publicKey: publicKeyString,
      refreshToken: tokens.refreshToken,
    })

    return {
      shop: getInfoData(foundShop, ['_id', 'name', 'email']),
      tokens,
    }
  }

  static signUp = async ({ name, email, password }) => {
    // Check email exist
    const holderShop = await ShopService.findByEmail({ email })

    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, _HASH_ROUNDS)

    const newShop = await ShopService.createShop({
      name,
      email,
      password: passwordHash,
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
        privateKey,
      })

      if (!publicKeyString) {
        return {
          code: 'xxx',
          message: 'Error!',
        }
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString)

      console.log(publicKeyObject)

      const { _id: userId } = newShop

      const tokens = await createTokenPair(
        { userId, email },
        publicKeyObject,
        privateKey,
      )
      console.log(`Create Token Success::`, tokens)

      await KeyTokenService.createKeyToken({
        userId,
        publicKey: publicKeyString,
        refreshToken: tokens.refreshToken,
      })

      return {
        shop: getInfoData(newShop, ['_id', 'name', 'email']),
        tokens,
      }
    }

    new OK()
  }
}

module.exports = AccessService
