/**
 * Index for Processor API routes
 */
const express = require('express')
const Processor = require('./processor_api')

const router = express.Router()

router.post('/process', Processor.process)

module.exports = router