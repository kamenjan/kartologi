const express = require('express')
const cors = require('cors')
const app = express()
let debug = require('debug')('app')
const path = require('path')

const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const env = app.get('env')

let port = '3000'
app.set('port', port)

const server = app.listen(port)

global.__basedir = __dirname

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/* Environment specifications */
switch (env) {
	case 'development':
		let logger = require('morgan')
		app.use(logger('dev'))
		break
	case 'production':
		break
}

app.use(fileUpload())

/* And of we go ... */
app.use(require('./controllers/routes'))

app.get('/', cors(), function (req, res) {
  res.send('kartologi api root')
})

/* Catch 404 and forward to error handler */
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err);
})

/* Development error handler [show stacktrace = TRUE] */
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
	  // This is REST post.js, no need for rendered errors, just send the error as response
	  res.send(err)
	  // res.status(err.status || 500)
	  // res.render('error', {
		//   message: err.message,
		//   error: err
	  // })
  })
}

/* Production error handler [show stacktrace = FALSE] */
app.use(function(err, req, res) {
	// This is REST post.js, no need for rendered errors, just send the error as response
	res.send(err)
	// res.status(err.status || 500)
	// res.render('error', {
	// 	message: err.message,
	// 	error: {}
	// })
})

module.exports = app;