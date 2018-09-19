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
    /* TODO: define specific fields. I surely don't need password :/  */
    const query = 'SELECT uid, username FROM users WHERE username = ? AND password = ?'
    db.get(query, [username, password], (err, user) => {
      err ? reject(err) : resolve(user)
    })
    return db.close()
  })
}

/* Public functions */
const userModel = {
  authenticate
}

module.exports = userModel