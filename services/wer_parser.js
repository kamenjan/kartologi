const xml2js = require('xml2js')
const parser = new xml2js.Parser()

const { composeAsync } = require('./functional')

const generateUID = () => Buffer.from(require('crypto').randomBytes(8)).toString('hex')

const xmlToJson = xmlString => {
  return new Promise( (resolve, reject) => {
    parser.parseString(xmlString, (err, json) => {
      if (err) reject(err)
      // NOTE: added return for brevity
      return resolve(json.event)
    })
  })
}

const addUids = uidGenerator => event => ({
  tournament: {
    uid: event['$'].eventguid,
    ... event['$']
  },
  players: event.participation[0].person.map( player => ({
    uid: uidGenerator(),
    ... player['$']
  })),
  rounds: event.matches[0].round.map( round => {
    const tmpRoundUid = uidGenerator()
    return {
      uid: tmpRoundUid, // I need this value ...
      tournament_uid: event['$'].eventguid,
      ... round['$'],
      matches: round.match.map( match => ({
        uid: uidGenerator(), // ... over here.
        round_uid: tmpRoundUid, // ... over here.
        ... match['$']
      }))
    }
  })
})

const concatRoundsMatches = event => ({
  ... event,
  matches: event.rounds.map( round => round.matches.map(match => match))
  .reduce((allMatches, roundMatches) => allMatches.concat(roundMatches))
})

const filterEventData = event => ({
  tournament: {
    ... event.tournament,
    date: event.tournament.startdate, // TODO: .toTimestamp
    rounds_total: event.tournament.numberofrounds
  },
  players: event.players.map( player => ({
    ... player,
    dci: player.id
  })),
  rounds: event.rounds.map(({uid, tournament_uid, date, number}) => ({
    uid, tournament_uid, date, number
  })),
  matches: event.matches.map(match => ({
    ... match,
    player_dci: match.person,
    opponent_dci: match.opponent
  }))
})

const addPlayersToTournaments = event => ({
  ... event,
  playersToTournament: event.players.map( ({dci}) => ({
    dci, tournament_uid: event.tournament.uid
  }))
})

const logData = event => {
  console.log(event)
  return event
}

const parseWerData = (werData) => {
  return composeAsync(
    // logData,
    xmlToJson,
    addUids(generateUID),
    concatRoundsMatches,
    filterEventData,
    addPlayersToTournaments
  )(werData)
}

module.exports = {
  parseWerData
}