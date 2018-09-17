const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const { composeAsync } = require('./functional')
const generateUID = () => Buffer.from(require('crypto').randomBytes(8)).toString('hex')

const readWerFile = (werFilePath) => {
  return new Promise( (resolve, reject) => {
    fs.readFile(werFilePath, (err, string) => {
      if (err) reject(err)
      parser.parseString(string, (err, json) => {
        if (err) reject(err)
        // NOTE: added return for brevity
        return resolve(json.event)
      })
    })
  })
}

const structureEventData = event => ({
  tournament: {
    uid: event['$'].eventguid,
    date: event['$'].startdate, // TODO: .toTimestamp
    roundsTotal: event['$'].numberofrounds,
    format: event['$'].format
  },
  players: event.participation[0].person.map( item => ({
    uid: generateUID(),
    dci: item['$'].id,
    name_first: item['$'].first,
    name_last: item['$'].last,
    country: item['$'].country,
  })),
  rounds: event.matches[0].round.map(round => ({
    uid: generateUID(),
    tournament_uid: event['$'].eventguid,
    number: round['$'].number,
    date: round['$'].date, // TODO: .toTimestamp
    matches: round.match.map( match => match['$'] )
  })),
  getMatches: function() {
    return this.rounds.map( round => round.matches.map( match => ({
      uid: generateUID(),
      round_uid: round.uid,
      player_dic: match.person,
      opponent_dic: match.opponent,
      outcome: match.outcome,
      win: match.win,
      loss: match.loss,
      draw: match.draw
    })))
    .reduce((allMatches, roundMatches) => allMatches.concat(roundMatches))
  },
  getRounds: function () {
    return this.rounds.map( ({uid, tournament_uid, number, date}) => ({
      uid, tournament_uid, number, date
    }))
  },
  getPlayersToTournament: function() {
    return this.players.map( player => ({
      player_dci: player.dci,
      tournament_uid: this.tournament.uid,
      deck: undefined
    }))
  }
})

const getEventDataFromWerFile = (pathToWerFile) => {
  return composeAsync(
    readWerFile,
    structureEventData
  )(pathToWerFile)
}

module.exports = {
  getEventDataFromWerFile
}