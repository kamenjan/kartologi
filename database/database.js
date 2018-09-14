/**
 * Database controller.
 *
 * Kartologi API uses sqlite database technology. It stores all the data in
 * a single sqlite3 file - database/kartologi.db.
 *
 * @todo explore option with multiple sqlite files
 *
 * @author kamenjan.
 */

const sqlite3 = require('sqlite3').verbose()

/* NOTE: if you change this, make sure you include new path in .gitignore */
const dbPath = `${__basedir}/database/kartologi.db`

/* Public functions */
const database = {
  open: () => {
    return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => {
      if (err) return console.error(err.message)
      console.log(`Connected to the ${dbPath} SQlite database.`)
    })
  },
  utils: {
    keysToFieldsString: obj => Object.keys(obj).join(','),
    setValuePlaceholders: obj => Object.keys(obj).map( () => '?').join(','),
    generateUID: () => Buffer.from(require('crypto').randomBytes(8)).toString('hex')
  }
}

module.exports = database