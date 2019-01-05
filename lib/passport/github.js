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

    return;

    User.findOne({ where: { githubId: profile.id } })
      .then(user => {
        user.githubToken = accessToken;
        if (user.email) {
          return user
            .save()
            .then(user => done(null, user))
            .catch(done);
        }

        // otherwise go get their email address and store it
        request(
          {
            url: 'https://api.github.com/user/emails',
            json: true,
            headers: {
              'user-agent':
                'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
              authorization: `token ${accessToken}`,
            },
          },
          (error, res, body) => {
            if (error) {
              return done(null, user);
            }

            user.email = body.find(_ => _.primary).email;

            user
              .save()
              .then(user => done(null, user))
              .catch(done);
          }
        );
      })
      .catch(e => done(e));
  }
);

module.exports = {
  strategy,
  root: passport.authenticate('github', {
    scope: ['user:email', 'gist', 'repo'],
  }),
  callback: passport.authenticate('github', { failureRedirect: '/auth/fail' }),
};
