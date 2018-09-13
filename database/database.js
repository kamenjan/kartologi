const sqlite3 = require('sqlite3').verbose()
const inspect = require('eyes').inspector({maxLength: false})

/* NOTE: if you change this, make sure you include new path in .gitignore */
const dbPath = `${__basedir}/database/kartologi.db`

/* UID generator  */
const crypto = require('crypto')
const generateUID = () => Buffer.from(crypto.randomBytes(8)).toString('hex')

const openDB = () => {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
    console.log(`Connected to the ${dbPath} SQlite database.`)
  })
}

/* Util functions */
const keysToFieldsString = (obj) => Object.keys(obj).join(',')
const setSqlite3ValuseString = (obj) => Object.keys(obj).map( () => '?').join(',')

/* Own functions */
const insertTournament = (tournament) => {
  return new Promise( (resolve, reject) => {
    const db = openDB()
    let {eventguid, startdate, format, numberofrounds} = tournament

    const tournamentRowData = {
      uid: eventguid,
      date: 897123469872146, // TODO: startdate to timestamp
      format,
      rounds_total: numberofrounds
    }

    const query = `INSERT INTO tournaments(${ keysToFieldsString(tournamentRowData) }) VALUES(${ setSqlite3ValuseString(tournamentRowData)})`
    const params = Object.values(tournamentRowData)

    db.run(query, params, (err) => {
      if (err) reject(err)
      resolve(`${{ ... this}}`)
    })
    db.close()
  })
}

const insertPlayers = (players) => {
  return new Promise( (resolve, reject) => {
    const db = openDB()
    const playerRowStructure = {
      uid: undefined,
      dci: undefined,
      name_first: undefined,
      name_last: undefined,
      country: undefined
    }

    const generateParams = (player) => [
      generateUID(), player.id, player.first, player.last, player.country
    ]

    /* Query for inserting players in players table */
    const query =
      `INSERT INTO players(${ keysToFieldsString(playerRowStructure) }) 
       VALUES(${ setSqlite3ValuseString(playerRowStructure)})`

    /* TODO: Query for inserting players in players_to_tournament table */

    db.serialize(() => {
      players
      .map( player => generateParams(player))
      .map((params) => db.run(query, params, (err) => err ? reject(err) : null))
      db.close( () => resolve() )
    })
  })
}

const insertRounds = (rounds) => {
  return new Promise( (resolve, reject) => {

  })
}

/* Public functions */
const database = {
  insertEventData: ({ tournament, players, rounds }) => {
    return new Promise( (resolve, reject) => {
      insertTournament(tournament)
      .then( () => insertPlayers(players) )
      // .then( () => insertRounds(rounds) )
      .then( () => resolve() )
      .catch( err => reject(err) )
    })
  }
}

module.exports = database