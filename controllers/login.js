/**
 * Login controller.
 *
 * This controller handles authentication by checking credentials sent from
 * browser using POST request. It checks against users in database and if
 * server side authentication is validated it generates a JWT token and sends it
 * back to browser.
 * a single sqlite3 file - database/kartologi.db.
 *
 * @author kamenjan.
 */


let express = require('express')
let router = express.Router()

const cors = require('cors')

const { readFile, writeFile } = require('../services/async_fs')

const userModel = require('../models/user')

router.post('/', cors(), function (req, res, next) {
  /* Grab data from login post request and check in DB for a match */
  userModel.login(req.body)
  .then( success => {
    success ? res.send('jej notr si, evo ti token') : res.send('gtfo')
  })
})


module.exports = router