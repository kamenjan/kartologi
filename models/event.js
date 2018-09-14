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
      // uid: eventguid,
      uid: utils.generateUID(), // TODO: so I can spam. Set back to eventguid
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

const insertPlayers = (players, tournament) => {
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

    const filterPlayerParams = player => [
      // TODO: spam mode, set back to player.id
      utils.generateUID(), player.id, player.first, player.last, player.country
      // utils.generateUID(), utils.generateUID(), player.first, player.last, player.country
    ]

    /* Query for inserting players in players table */
    const insertPlayerQuery =
      `INSERT INTO players(${ utils.keysToFieldsString(playerRowStructure) }) 
       VALUES(${ utils.setValuePlaceholders(playerRowStructure) })`

    const insertPlayerToTournamentQuery =
      `INSERT INTO players_to_tournaments(${ utils.keysToFieldsString(playerToTournamentRowStructure) }) 
       VALUES(${ utils.setValuePlaceholders(playerToTournamentRowStructure) })`

    db.serialize(() => {
      players
      .map( player => filterPlayerParams(player))
      .map( params => {
        db.run(insertPlayerQuery, params, err => err ? reject(err) : null)
        return [ params[0], tournament.eventguid, 'majka mila kk dek' ]
      }).map( params => {
        db.run(insertPlayerToTournamentQuery, params, err => err ? reject(err) : null)
      })
      db.close( () => resolve() )
    })
  })
}

const insertRounds = (rounds, tournament) => {
  return new Promise( (resolve, reject) => {
    const db = database.open()

    const roundFields = () => ['uid', 'date', 'tournament_uid']
    const fliterRoundFields = round => ({
      uid: utils.generateUID(),
      date: 897123469872146, // TODO: convert round.date to timestamp
      tournament_uid: tournament.eventguid
    })

    const insertRoundQuery =
      `INSERT INTO rounds(${roundFields().join(',')}) 
       VALUES(${ roundFields().map(() => '?').join(',') })`

    const matchFields = () => ['uid', 'round_uid', 'player', 'opponent', 'outcome', 'win', 'loss', 'draw']
    const fliterMatchFields = (match, round) => ({
      uid: utils.generateUID(),
      round_uid: round,
      player: match.person,

    })

    const insertMatchQuery =
      `INSERT INTO rounds(${matchFields().join(',')}) 
       VALUES(${ matchFields().map(() => '?').join(',') })`

    db.serialize(() => {
      rounds
      .map( round => {
        console.log(round);
        round.matches.map( match => {
          return Object.values(fliterMatchFields(match))
        })
        .map( params => {
          db.run(insertMatchQuery, params, err => err ? reject(err) : null)
        })
        return Object.values(fliterRoundFields(round))
      })
      .map( params => {
        db.run(insertRoundQuery, params, err => err ? reject(err) : null)
      })
      db.close( () => resolve() )
    })
  })
}

/* Public functions */
const eventModel = {
  insertData: ({ tournament, players, rounds }) => {
    return new Promise( (resolve, reject) => {
      insertTournament(tournament)
      .then( () => insertPlayers(players, tournament) )
      .then( () => insertRounds(rounds, tournament) )
      .then( () => resolve({
        message: 'Tournament data successfully parsed and saved.',
        err: undefined
      }))
      .catch( err => reject({
        message: 'There was a problem with upload or data integrity, ' +
        'check error message for more information.',
        err
      }) )
    })
  }
}

module.exports = eventModel