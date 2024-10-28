'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../core/asyncHandler')

// Sign Up

router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router
