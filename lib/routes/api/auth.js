const express = require('express');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const { root, callback } = require('../../strategy/github');
const router = express.Router();

module.exports = router;

function generateToken(user, expiresIn = '1 hour') {
  const { id, username, github_token, pro, settings } = user.get({
    plain: true,
  });
  return jwt.sign(
    { id, username, pro, github: github_token, settings },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

router.get('/', root);
router.get('/fail', (req, res, next) => next(401));
router.get('/callback', callback, (req, res) => {
  res.redirect('http://localhost:3001/?token=' + generateToken(req.user));
  // res.json({
  //   bearerToken: generateToken(req.user),
  //   expiresIn: '1 hour',
  //   expires: ms('1 hour'),
  // });
});
