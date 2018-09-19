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
const passport = require('passport')

/* Middleware */
const cors = require('cors')
const auth = require('../services/auth')
const { generateJWT } = require('../services/jwt')

const { readFile, writeFile } = require('../services/async_fs')

const userModel = require('../models/user')

router.post('/login', cors(), function (req, res, next) {
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) return next(err)
    if (passportUser) {
      const user = {
        uid: passportUser.uid,
        username: passportUser.username
      }
      // console.log('uspesno logiran, sta ima?');
      return res.json({ token: generateJWT(user) }) // need arguments to structure jwt
    }
    // console.log('kdo si ti supak? spizdi');
    return res.send('gtfo creep') // need arguments to structure jwt
  })(req, res, next)
})

/* getting through request with modified headers and preflight OPTIONS request */
// https://www.npmjs.com/package/cors#configuration-options
const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}

router.post('/private', [cors(), auth.required], function (req, res, next) {
  console.log('evo me tuki')
  return res.send()
})

router.get('/private', [cors(), auth.required], function (req, res, next) {
  console.log('evo me tuki')
  return res.send()
})

module.exports = router