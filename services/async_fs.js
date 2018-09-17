const fs = require('fs')

const writeFile = (path, data, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.writeFile(path, data, opts, (err) => {
      err ? rej(err) : res(data)
    })
  })

const readFile = (path, opts = 'utf8') =>
  new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      err ? rej(err) : res(data)
    })
  })

module.exports = {
  readFile,
  writeFile
};