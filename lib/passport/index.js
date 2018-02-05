// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const passport = require('passport');
const User = require('../db/user');

if (process.env.NODE_ENV !== 'test') {
  passport.use('github', require('../passport/github').strategy);
}

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  User.findOne({ where: { username } })
    .then(user => {
      done(null, user);
    })
    .catch(done);
});

module.exports = passport;
