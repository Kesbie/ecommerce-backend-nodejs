'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')

const router = express.Router()

// Check API Key
// router.use(apiKey)

// Check Permission
// router.use(permission)

router.use('/v1/api/', require('./access'))

module.exports = router