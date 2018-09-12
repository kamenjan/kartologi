const fs = require('fs')
const xml2js = require('xml2js')
const inspect = require('eyes').inspector({maxLength: false})
const parser = new xml2js.Parser()

let players, matches

const parseXML = (pathToFile) => {
  fs.readFile(pathToFile, function(err, data) {
    parser.parseString(data, function (err, data) {

      players = data.event.participation[0].person.map( item => item['$'])

      let novArray = []

      matches = data.event.matches[0].round
      .map( (roundMatches, index, array) => {
        roundMatches.match.map( match => novArray.push(match['$']))
      })
      // processPlayer(novArray, players)
      console.log(novArray);
    })
  })
}

const parseXML1 = (pathToFile) => {
  fs.readFile(pathToFile, function(err, data) {
    parser.parseString(data, function (err, data) {

      const rounds = data.event.matches[0].round

      inspect(rounds)
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


// parseXML('../data/live_example.xml')
parseXML1('../data/live_example.xml')