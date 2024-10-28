'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // Access Token

    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error::`, err)
      } else {
        console.log(`decode:: `, decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createTokenPair,
}
