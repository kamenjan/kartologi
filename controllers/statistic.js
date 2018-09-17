let express = require('express')
let router = express.Router()

const cors = require('cors')

const { readFile, writeFile } = require('../services/async_fs')

const { parseWerData } = require('../services/wer_parser')

const eventModel = require('../models/event')

/* SOURCE: https://codeburst.io/asynchronous-file-upload-with-node-and-react-ea2ed47306dd */
router.post('/upload', cors(), function (req, res, next) {

  // Grab file from the request ...
  let werFile = req.files.file
  // ... set file upload path ...
  const werFilePath = `${__basedir}/upload/${req.body.filename}.xml`
  // ... and archive the file
  werFile.mv(werFilePath) // TODO: error handling
  .then( () => readFile(werFilePath) )
  .then( fileContent => parseWerData(fileContent) )
  .then( parsedEventData => res.send(parsedEventData) )
  .catch(err => {
    console.log(err)
    res.send( err )
    // TODO: log error in db
  })
})

/* TODO: Before saving data to DB, user should append decks to players */
router.get('/update', cors(), function (req, res, next) {

})

module.exports = router