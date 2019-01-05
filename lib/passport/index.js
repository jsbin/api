// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const passport = require('passport');
const User = require('../db/user');

if (process.env.NODE_ENV !== 'test') {
  passport.use('github', require('../passport/github').strategy);
}

passport.serializeUser((user, done) => {
  done(null, user.token);
});

passport.deserializeUser((token, done) => {
  done({ token });
});

module.exports = passport;
