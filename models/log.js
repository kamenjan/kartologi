/**
 * Log module.
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
const log = (logData) => {
  return new Promise( (resolve, reject) => {
    const db = database.open()

    // console.log(logData);

    const parameters = [
      "q234f", "12.3.2018", "error", 'manjka ti jebeno podpicje', 'nekje'
    ]

    const addLogQuery = `INSERT INTO log uid, date, type, msg, location VALUES(?,?,?,?,?)`
    db.run(addLogQuery, params, err => {err ? reject(err) : null})
    db.close( () => resolve() )
  })
}

/* Public functions */
const logModel = {
  log
}

module.exports = logModel