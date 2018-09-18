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

/* Own functions */
const login = ({ username, password }) => {
  return new Promise( (resolve, reject) => {
    const db = database.open()
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = ? AND password = ?)'
    db.get(query, [username, password], (err, row) => {
      const success = Object.values(row)[0]
      if (err) reject(err)
      resolve(success)
    })
    return db.close()
  })
}

/* Public functions */
const userModel = {
  login
}


module.exports = userModel