let express = require('express')
let router = express.Router()

const cors = require('cors')

const path = require('path')
const warFilePath = path.join(__basedir, '__DEV/data/live_example.xml')

const werParser = require('../services/wer_parser')

router.get('/', cors(), function (req, res) {
  // werParser.getEventDataFromWerFile(warFilePath)
  // .then( response => {
  //   res.send(response)
  // })
})

router.post('/upload', cors(), function (req, res, next) {
  let werFile = req.files.file
  let werFilePath = `${__basedir}/upload/${req.body.filename}.xml`

  werFile.mv(werFilePath)
  .then(() => {
    return werParser.getEventDataFromWerFile(warFilePath)
  }).then( response => {
    res.send(response)
  }).catch( err => {
    console.log(err)
  })

})

module.exports = router