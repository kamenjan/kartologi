const express = require('express')
const app = express()

/* System imports */
const path = require('path')
const env = app.get('env')

/* Global configuration */
const conf = require('./config/config')(env)

/* Development tools */
const debug = require('debug')('app')

/* Request utils */
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

/* Set application attributes and few globals (OMG don't do that!! :P ...) */
/* NOTE: I do not need template generator */
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
global.__basedir = __dirname
global.__inspect = require('eyes').inspector({maxLength: false})

/* Header middleware */
const { setHeader, handlePreflightRequest } = require('./middleware/header')

/* Session middleware */
/* NOTE: Do I need this? I'm sending jwt to client ... */
const session = require('express-session')

/* Error handling middleware */
const { fourOhFour, handleError } = require('./middleware/errors')

/* Use global application services */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(session(conf.session))
app.use([ setHeader, handlePreflightRequest ]) // TODO: testing session data

/* Use the controllers */
app.use(require('./controllers/routes'))

/* Environment specifications */
switch (env) {
	case 'development':
		let logger = require('morgan')
		app.use(logger('dev'))
		break
	case 'production':
    app.set('trust proxy', 1) // When in production node is proxied via apache
		break
}

/* Kartologi root get route */
app.get('/', cors(), function (req, res) {
  res.send('kartologi api root')
})

/* Error handlers */
app.use([ fourOhFour, handleError(env) ])

module.exports = app;