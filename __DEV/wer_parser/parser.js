const fs = require('fs')
const xml2js = require('xml2js')
const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('../data/db.sqlite3')
const parser = new xml2js.Parser()
const crypto = require('crypto')

let players, matches

/* UID generator */
const generateUID = () => Buffer.from(crypto.randomBytes(8)).toString('hex')



const parseXML = (pathToFile) => {
  fs.readFile(pathToFile, function(err, data) {
    parser.parseString(data, function (err, data) {

      players = data.event.participation[0].person.map( item => item['$'])

      let novArray = []

      matches = data.event.matches[0].round
      .map( round => round.match )
      .map( matchesArray => {
        matchesArray.map( match => novArray.push(match['$']))
      })
      // processPlayer(novArray, players)
    })
  })
}


const processPlayer = (matches, players) => {
  players.forEach( player => {
    matches.forEach( match => {
      if (player.id === match.person) {
        // console.log(`winner = ${player.last} ${player.id}`)
        players.forEach( player => {
          if (player.id === match.opponent) {
            // console.log(`opponent = ${player.last} ${player.id}`)
          }
        })
      }
    })
  })
}


function openSQLiteConnection () {
  let db = new sqlite3.Database('../data/db.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log('Connected to the db.sqlite3 SQlite database.')
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

// parseXML('../data/live_example.xml')
openSQLiteConnection()