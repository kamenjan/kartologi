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
// const passport = require('passport')
const { readFile, writeFile } = require('../services/async_fs')

/* Middleware */
const cors = require('cors')

const jwt = require('jsonwebtoken')
const { authMiddleware, generateJWT, getTokenFromHeaders } = require('../services/auth')
// const { generateJWT, jwt } = require('../services/jwt')

const userModel = require('../models/user')

router.post('/login', cors(), function (req, res, next) {

  const {username, password} = req.body

  userModel.authenticate({username, password})
  .then( user => {

    if (user) {
      console.log('success in my custom passport.js')
      return res.json({ token: generateJWT(user) }) // need arguments to structure jwt
    }

    console.log('fail in my custom passport.js')
    return res.send('gtfo creep')

  })
  .catch( err => {
    /* TODO: log error in DB */
    console.log(err)
  })
})

/* TODO: getting through request with modified headers and preflight OPTIONS request */
// https://www.npmjs.com/package/cors#configuration-options
const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}

router.post('/private', [cors(), authMiddleware.required], function (req, res, next) {
  console.log('evo me tuki')
  return res.send('pozdrav iz /private post')
})

router.get('/private', [cors(), authMiddleware.required], function (req, res, next) {
  console.log('evo me tuki')
  console.log(req.body);
  console.log(getTokenFromHeaders(req))
  const decoded = jwt.decode(getTokenFromHeaders(req))
  console.log(decoded);
  return res.send('pozdrav iz /private get')
})

module.exports = router