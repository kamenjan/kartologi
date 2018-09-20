/**
 * Authentication service.
 *
 * @todo: Write description.
 *
 * @author kamenjan.
 */

/* Express jwt authentication middleware */
const expressJwt = require('express-jwt')

/* Core jwt package for signing and decoding */
const jwt = require('jsonwebtoken')

const generateJWT = json => {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    ... json,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1]
  }
  return null;
}

const getTokenFromSession = req => req.session.token


const authMiddleware = {
  required: expressJwt({
    secret: 'secret',
    userProperty: 'payload',
    // getToken: getTokenFromHeaders,
    getToken: getTokenFromSession
  }),
  optional: expressJwt({
    secret: 'secret',
    userProperty: 'payload',
    // getToken: getTokenFromHeaders,
    getToken: getTokenFromSession,
    credentialsRequired: false
  })
}

/* Public functions */
const authentication = {
  generateJWT,
  getTokenFromHeaders,
  getTokenFromSession,
  authMiddleware
}

module.exports = authentication