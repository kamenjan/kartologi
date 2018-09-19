const jwt = require('jsonwebtoken')

const generateJWT = json => {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign({
    ... json,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

const toAuthJSON = json => ({
    user: this.username,
    token: generateJWT({uid: user.uid, username: user.username})
})

const jwtWrapper = {
  generateJWT
}

module.exports = jwtWrapper