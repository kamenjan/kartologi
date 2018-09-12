const sqlite3 = require('sqlite3').verbose()

const inspect = require('eyes').inspector({maxLength: false})

// const db = new sqlite3.Database('../data/example.db.sqlite3')

const productionDB = './db.sqlite3'

/* UID generator  */
const crypto = require('crypto')
const generateUID = () => Buffer.from(crypto.randomBytes(8)).toString('hex')



function openSQLiteConnection () {

  let db = new sqlite3.Database(productionDB, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log('Connected to the example.db.sqlite3 SQlite database.')
  })

  const query = `INSERT INTO players(uid) VALUES(?)`
  const params = ['nektestnuid']

  // db.run(query, params, (err) => {
  //   if (err) return console.error(err.message)
  //   console.log(`A row has been inserted with rowid ${this.lastID}`);
  // })

  const query2 = `SELECT * FROM players`;
  db.all(query2, [], (err, rows) => {
    if (err) throw err
    rows.forEach( (row) => console.log(row) )
  })

  db.close()
}
// openSQLiteConnection()