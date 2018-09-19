/**
 * User module.
 *
 * @todo: Write description.
 *
 * @author kamenjan.
 */

const database = require('../database/database')
const { utils } = require('../database/database')
const { compose } = require('../services/functional')

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/* Own functions */
const authenticate = ({ username, password }) => {
  return new Promise( (resolve, reject) => {
    const db = database.open()
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?'
    db.get(query, [username, password], (err, user) => {
      err ? reject(err) : resolve(user)
    })
    return db.close()
  })
}

const generateJWT = function() {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

const toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  }
}


/* Public functions */
const userModel = {
  authenticate,
  generateJWT
}


module.exports = userModel