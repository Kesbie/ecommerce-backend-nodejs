'use strict'

const shopModel = require('../models/shop.model')
const { ROLESHOP } = require('../constants')

class ShopService {
  static findByEmail = async ({
    email,
    select = {
      email: 1,
      password: 1,
      name: 1,
      status: 1,
      roles: 1,
    },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean()
  }

  static createShop = async ({
    name,
    email,
    password,
    roles = [ROLESHOP.SHOP],
  }) => {
    return await shopModel.create({
      name,
      email,
      password,
      roles,
    })
  }
}

module.exports = ShopService
