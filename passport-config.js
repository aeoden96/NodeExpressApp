const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { ROLE } = require('./data')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
/*
    //NEED TO REMOVE
    if(user.role == ROLE.ADMIN){
      return done(null, user)
    }
    //NEED TO REMOVE/*
    if(user.role == ROLE.BASIC){
      return done(null, user)
    }*/
    ////////////////////////

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize