const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const { composeAsync } = require('./functional')

const readWerFile = (werFilePath) => {
  return new Promise( (resolve, reject) => {
    fs.readFile(werFilePath, (err, string) => {
      if (err) reject(err)
      parser.parseString(string, (err, json) => {
        if (err) reject(err)
        resolve(json.event)
      })
    })
  })
}


/* TODO: finer data parsing before sending to db */
const structureEventData = (event) => ({
  tournament: {
    uid: event['$'].eventguid,
    date: event['$'].startdate, // TODO: .toTimestamp
    roundsTotal: event['$'].numberofrounds,
    format
  },
  players: event.participation[0].person.map( item => item['$'] ),
  rounds: event.matches[0].round.map(round => ({
    ... round['$'],
    matches: round.match.map( match => match['$'] )
  }))
})

// NOTE: small and simple functions in order:
// parse tournament date
// assign tournament uid to rounds
// generate rounds uids
// assign round uid to matches
// generate matches uids

// NOTE: example of data structure for each event related table (except players_to_tournaments)
const tournamentRowData = {
  uid: eventguid,
  date: startdate.toTimestamp, // startdate = "2018-09-10" TODO: convert
  format,
  rounds_total: numberofrounds
}

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

const roundRowStructure = {
  round_uid: undefined,
  tournament_uid: undefined,
  date: undefined
}

const matchRowStructure = {
  match_uid: undefined,
  round_uid: undefined,
  player: undefined,
  opponent: undefined,
  outcome: undefined,
  win: undefined,
  loss: undefined,
  draw: undefined
}

const getEventDataFromWerFile = (pathToWerFile) => {
  return composeAsync(
    readWerFile,
    structureEventData
  )(pathToWerFile)
}

module.exports = {
  getEventDataFromWerFile
}