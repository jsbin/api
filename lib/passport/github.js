const passport = require('passport');
const request = require('request');
const jwt = require('jsonwebtoken');
const User = require('../db/user');
const Strategy = require('passport-github2').Strategy;
const octokit = require('@octokit/rest');

const strategy = new Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
    // callbackURL: process.env.GITHUB_CALLBACK,
  },
  async (accessToken, refreshToken, profile, done) => {
    const githubToken = accessToken;
    const { username } = profile;

    const token = jwt.sign({ username, githubToken }, process.env.JWT_SECRET, {
      expiresIn: '1y',
    });

    const github = octokit();
    github.authenticate({
      type: 'oauth',
      token: accessToken,
    });

    // FIXME make private option that's passed in
    github.repos
      .createForAuthenticatedUser({
        name: 'bins',
        description: `All ${username}'s bins`,
        private: false,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        auto_init: false,
        license_template: 'mit',
      })
      .catch(e => {
        console.log(e);
      })
      .then(repo => {
        console.log(repo);

        return github.repos.updateInformationAboutPagesSite({
          owner: username,
          repo: 'bins',
          source: 'master',
          cname: 'null',
        });
      })
      .catch(e => {
        console.log(e);
      })
      .then(res => {
        console.log(res);

        done(null, { token });
      });
  }
);

module.exports = {
  strategy,
  root: passport.authenticate('github', {
    scope: ['user:email', 'gist', 'repo'],
  }),
  callback: passport.authenticate('github', { failureRedirect: '/auth/fail' }),
};
