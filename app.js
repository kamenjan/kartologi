const express = require('express')
const cors = require('cors')
const app = express()
const debug = require('debug')('app')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const conf = require('./config/config')

const env = app.get('env')

const fileUpload = require('express-fileupload')
app.use(fileUpload())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* session */
app.use(session(conf.session))

/* A few globals, just to keep things interesting ;) */
global.__basedir = __dirname
global.__inspect = require('eyes').inspector({maxLength: false})

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

/* TODO: Works for now. Make sense out of all this! */
/* Some convoluted fucked up shit to handle JWT tokens in request headers */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200) // Tell browser we approve of this shit ...
  } else {
    next() // ... else move on
  }
})

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