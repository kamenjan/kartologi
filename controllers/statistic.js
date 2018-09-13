let express = require('express')
let router = express.Router()

const cors = require('cors')

const werParser = require('../services/wer_parser')
const db = require('../database/database')

/* SOURCE: https://codeburst.io/asynchronous-file-upload-with-node-and-react-ea2ed47306dd */
router.post('/upload', cors(), function (req, res, next) {

  let werFile = req.files.file
  const werFilePath = `${__basedir}/upload/${req.body.filename}.xml`
  werFile.mv(werFilePath)
  .then( () => werParser.getEventDataFromWerFile(werFilePath))
  .then( eventData => db.insertEventData(eventData) )
  .then( () => res.send( 'Upload and save successful' ))
  .catch( err => {
    console.log(err)
    res.send( err )
    // TODO: log error in db
  })
})

router.get('/insert', cors(), function (req, res, next) {

})

router.get('/players', cors(), function (req, res, next) {

})

module.exports = router