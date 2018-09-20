const setHeader = (req, res, next) => {
  /* TODO: FAKE ODKRITJE! this should be set to kartologi client domain! */
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  // res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
}

// If we get OPTIONS request tell browser we approve of this and he can hit us
// with next request. Otherwise just move along.
const handlePreflightRequest = (req, res, next) => {
  req.method === 'OPTIONS' ? res.sendStatus(200) : next()
}

const headerMiddleware = {
  setHeader,
  handlePreflightRequest
}

module.exports = headerMiddleware