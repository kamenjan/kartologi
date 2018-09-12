const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const werFilePath = '../data/live_example.xml'

const inspect = require('eyes').inspector({maxLength: false})

/* UID generator  */
const crypto = require('crypto')
const generateUID = () => Buffer.from(crypto.randomBytes(8)).toString('hex')

const readWerFile = (pathToFile) => {
  fs.readFile(pathToFile, (err, string) => {
    parser.parseString(string, (err, json) => {
      inspect(structureWerData(json.event))
    })
  })
}

const structureWerData = (event) => ({
  tournament: { ...event['$'] },
  players: event.participation[0].person.map( item => item['$'] ),
  rounds: event.matches[0].round.map(round => ({
    ... round['$'],
    matches: round.match.map( match => match['$'] )
  }))
})

readWerFile(werFilePath)