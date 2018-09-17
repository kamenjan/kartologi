let express = require('express')
let router = express.Router()

const cors = require('cors')

const werParser = require('../services/wer_parser')
const eventModel = require('../models/event')

/* SOURCE: https://codeburst.io/asynchronous-file-upload-with-node-and-react-ea2ed47306dd */
router.post('/upload', cors(), function (req, res, next) {

  let werFile = req.files.file
  const werFilePath = `${__basedir}/upload/${req.body.filename}.xml`
  werFile.mv(werFilePath)
  .then(() => werParser.getEventDataFromWerFile(werFilePath))
  .then(eventData => {
    console.log(eventData)
  })
  // .then(eventData => eventModel.insertData(eventData))
  // .then(insertResponse => res.send(insertResponse))
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