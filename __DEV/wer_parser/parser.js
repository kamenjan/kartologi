const fs = require('fs')
const xml2js = require('xml2js')

const parser = new xml2js.Parser()

let players, matches

fs.readFile('../data/live_example.xml', function(err, data) {
  parser.parseString(data, function (err, data) {

    players = data.event.participation[0].person.map( item => item['$'])

    let novArray = []

    matches = data.event.matches[0].round
    .map( round => round.match )
    .map( matchesArray => {
      matchesArray.map( match => novArray.push(match['$']))
    })
    processPlayer(novArray, players)
  })
})

function processPlayer (matches, players) {

  players.forEach( player => {
    matches.forEach( match => {
      if (player.id === match.person) {
        console.log(`winner = ${player.last} ${player.id}`)
        players.forEach( player => {
          if (player.id === match.opponent) {
            console.log(`opponent = ${player.last} ${player.id}`)
          }
        })
      }
    })
  })
}


