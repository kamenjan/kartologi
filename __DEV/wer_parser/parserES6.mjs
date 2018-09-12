import fs from 'fs'
import xml2js from 'xml2js'
const parser = new xml2js.Parser()

// import path from 'path'
// const appDir = path.dirname(require.main.filename)

const werFilePath = `${global.appRoot}/data/live_example.xml`

import eyes from 'eyes'
const inspect = eyes.inspector({maxLength: false})

export default {
  readWerFile: (werFilePath) => {
     return new Promise( (resolve, reject) => {
      fs.readFile(werFilePath, (err, string) => {
        if (err) reject(err)
        parser.parseString(string, (err, json) => {
          if (err) reject(err)
          resolve(json.event)
        })
      })
    })
  },
  structureEventData: function (event) {
    // inspect(event);
    return {
      tournament: { ...event['$'] },
      players: event.participation[0].person.map( item => item['$'] ),
      rounds: event.matches[0].round.map(round => ({
        ... round['$'],
        matches: round.match.map( match => match['$'] )
      }))
    }
  },
  getEventData: () => this.structureEventData(this.readWerFile(werFilePath)),
  test: () => {
    console.log(global.appRoot);
  }
}
