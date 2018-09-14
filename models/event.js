/**
 * Event module.
 *
 * @todo: Write description.
 *
 * @author kamenjan.
 */

const database = require('../database/database')

const { utils } = require('../database/database')

/* Own functions */
const insertTournament = tournament => {
  return new Promise( (resolve, reject) => {
    const db = database.open()
    let {eventguid, startdate, format, numberofrounds} = tournament

    const tournamentRowData = {
      uid: eventguid,
      date: 897123469872146, // TODO: convert startdate to timestamp
      format,
      rounds_total: numberofrounds
    }

    const query =
      `INSERT INTO tournaments(${ utils.keysToFieldsString(tournamentRowData) }) 
       VALUES(${ utils.setValuePlaceholders(tournamentRowData)})`

    const params = Object.values(tournamentRowData)

    db.run(query, params, err => err ? reject(err) : resolve(`${{ ... this}}`))
    db.close()
  })
}

const insertPlayers = players => {
  return new Promise( (resolve, reject) => {

    const db = database.open()

    const playerRowStructure = {
      uid: undefined,
      dci: undefined,
      name_first: undefined,
      name_last: undefined,
      country: undefined
    }

    const playerToTournamentRowStructure = {
      player_uid: undefined,
      tournament_uid: undefined,
      deck: undefined
    }

    const generateParams = player => [
      utils.generateUID(), player.id, player.first, player.last, player.country
    ]

    /* Query for inserting players in players table */
    const insertPlayerQuery =
      `INSERT INTO players(${ utils.keysToFieldsString(playerRowStructure) }) 
       VALUES(${ utils.setValuePlaceholders(playerRowStructure) })`

    /* TODO: Query for inserting players in players_to_tournament table */
    const insertPlayerToTournamentQuery =
      `INSERT INTO players_to_tournaments(${ utils.keysToFieldsString(playerRowStructure) }) 
       VALUES(${ utils.setValuePlaceholders(playerRowStructure) })`

    db.serialize(() => {
      players
      .map( player => generateParams(player))
      .map( params => db.run(insertPlayerQuery, params, err => err ? reject(err) : null))
      db.close( () => resolve() )
    })
  })
}

const insertRounds = rounds => {
  return new Promise( (resolve, reject) => {
    // const db = database.open()
    resolve()
  })
}

/* Public functions */
const eventModel = {
  insertData: ({ tournament, players, rounds }) => {
    return new Promise( (resolve, reject) => {
      insertTournament(tournament)
      .then( () => insertPlayers(players) )
      // .then( () => insertRounds(rounds) )
      .then( () => resolve({
        error: undefined,
        message: 'Tournament data successfully parsed and saved.'
      }))
      .catch( err => reject({
        error: err,
        message: 'There was a problem with upload or data integrity, ' +
        'check error message for more information.'
      }) )
    })
  }
}

module.exports = eventModel