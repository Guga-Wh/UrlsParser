const express = require('express')
const router = new express.Router()
const urlController = require('../controllers/urlRouter')


router.post('/router',urlController.urlParse)

module.exports = router
