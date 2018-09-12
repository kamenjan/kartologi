// run with node --experimental-modules main.mjs

import werParser from "./wer_parser/parserES6.mjs"

import eyes from 'eyes'
const inspect = eyes.inspector({maxLength: false})

import path from 'path'
const __dirname = path.dirname(new URL(import.meta.url).pathname)
global.appRoot = path.resolve(__dirname)

const werFilePath = `${global.appRoot}/data/live_example.xml`

werParser.readWerFile(werFilePath).then(response => {
  let data = werParser.structureEventData(response)

  inspect(data)

}).catch( err => {
  console.log(err);
})
