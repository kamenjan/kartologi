/**
 * Login controller.
 *
 * This controller handles authentication by checking credentials sent from
 * browser using POST request. It checks against users in database and if
 * server side authentication is validated it generates a JWT token and sends it
 * back to browser.
 *
 * @author kamenjan.
 */

let express = require('express')
let router = express.Router()

/* Middleware */
const cors = require('cors')

const jwt = require('jsonwebtoken')
const { authMiddleware, generateJWT, getTokenFromHeaders, getTokenFromSession } = require('../services/auth')

const userModel = require('../models/user')
const { log } = require('../models/log')

router.post('/login', cors(), function (req, res, next) {
  const {username, password} = req.body
  userModel.authenticate({username, password})
  .then( user => {
    if (user) {

      // NOTE: Send secure session instead of plain JWT token
      req.session.jwt = generateJWT(user)

      /* TODO: log successful authentication in DB */
      console.log(`User ${username} has been successfully authenticated.`)

      return res.json({ msg: `User ${username} has been successfully authenticated.` })
    }

    /* TODO: log failed authentication in DB */
    console.log(`User ${username} has failed authentication.`)

    return res.send({ msg: `User ${username} has failed authentication.` })
  })
  .catch( err => {
    // log(err) // TODO: log error in DB
    console.log(err)
  })
})

/* TODO: getting through request with modified headers and preflight OPTIONS request */
// https://www.npmjs.com/package/cors#configuration-options
const corsOptions = {
  // "origin": "*",
  "origin": 'http://localhost:8080', // kartologi.kancelarija.tech in production FAKE ODKRITJE
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "credentials": true,
}



router.post('/private', [cors(corsOptions), authMiddleware.required], function (req, res) {
  console.log('prajvt')
  return res.send('pozdrav iz /private post')
})

router.get('/private', [cors()], function (req, res) {
  console.log('prajvt get')
  console.log(req.session);
  console.log(req.session.token);
  // console.log(req.body);
  // console.log(getTokenFromHeaders(req))
  // const decoded = jwt.decode(getTokenFromHeaders(req))
  // console.log(decoded);
  return res.send('pozdrav iz /private get')
})


/* NOTE: test express-session */
router.get('/getcookie', [cors(corsOptions)], function (req, res) {
  console.log('u get cookie routerju')
  req.session.token = generateJWT({name: "rok"})
  return res.send('pozdrav iz getcookie routerja')
})

router.get('/returncookie', [cors(corsOptions), authMiddleware.required], function (req, res) {
  console.log('u return cookie routerju')
  console.log('session token:');
  // __inspect(req.session)
  console.log(req.session.token)
  console.log(jwt.decode(req.session.token))
  return res.send('pozdrav iz return cookie routerja')
})

router.get('/clearsession', [cors(corsOptions)], function (req, res) {
  console.log('session destroyed')
  req.session.destroy()
  return res.send('session destroyed')
})

/* NOTE: test next() for error handling and logModel for error reporting */
// router.get('/next', [cors(), authMiddleware.optional], function (req, res, next) {
//   console.log('u next routerju')
//   next()
//   // return res.send('pozdrav iz next routerja')
// })

module.exports = router