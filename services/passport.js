const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const usePassport = userModel => {
  return passport.use(new LocalStrategy(
    function(username, password, done) {
      userModel.authenticate({username, password})
      .then( user => {
        if (user) {
          // console.log('success in my custom passport.js')
          return done(null, user)
        } else {
          // console.log('fail in my custom passport.js')
          return done(null, false, { message: 'GTFO.' })
        }
      })
      .catch(done)
    }
  ))
}

module.exports = usePassport
