'use strict'

const AccessService = require('../services/access.service')
const { OK, CREATED } = require('../core/success.response')

class AccessController {
  logout = async (req, res, next) => {
    new OK({
      message: 'Logout Success!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async (req, res, next) => {
    new OK({
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Create Shop Success',
      metadata: await AccessService.signUp(req.body),
    }).send(res)
  }
}

module.exports = new AccessController()
