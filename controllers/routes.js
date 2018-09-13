let express = require('express')
let router = express.Router()

router.use('/post', require('./post'))
router.use('/statistic', require('./statistic'))

module.exports = router
