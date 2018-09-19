let express = require('express')
let router = express.Router()

router.use('/post', require('./post'))
router.use('/upload', require('./upload'))
router.use('/users', require('./users'))

module.exports = router