let express = require('express');
let router = express.Router();

const cors = require('cors');

router.get('/', cors(), function (req, res) {

});

module.exports = router;