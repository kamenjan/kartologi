const { log } = require('../models/log')

const fourOhFour = (req, res, next) => {
  console.log('404');
  let err = { msg: 'resource not found'}
  err.status = 404
  next(err);
}

const handleError = (env) => (err, req, res, next) => {
  const dev = (env === 'development')
  res.status(err.status || 500)

  // log({
  //   message: err.message,
  //   type: "error",
  //   error: err
  // })
  console.log('error jejej ====');
  __inspect(err)
  console.log('error jejej ====');
  res.send()
}

const errorMiddleware = {
  fourOhFour,
  handleError
}

module.exports = errorMiddleware