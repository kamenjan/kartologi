const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const { composeAsync } = require('./functional')

/* Debugging tools for deep objects. Make global? */
// const eyes = require('eyes')
// const inspect = eyes.inspector({maxLength: false})

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

const structureEventData = (event) => {
  return {
    tournament: { ...event['$'] },
    players: event.participation[0].person.map( item => item['$'] ),
    rounds: event.matches[0].round.map(round => ({
      ... round['$'],
      matches: round.match.map( match => match['$'] )
    }))
  }
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