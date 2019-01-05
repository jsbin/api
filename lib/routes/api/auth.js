const express = require('express');
const { root, callback } = require('../../passport/github');
const requireUser = require('../middleware/require-user');
const uuid = require('uuid/v4');
const LRU = require('lru-cache');
const options = {
  maxAge: 1000 * 10,
};
const cache = LRU(options);
const router = express.Router();

module.exports = router;

router.get('/refresh', requireUser, (req, res) => {
  res.json({ token: req.user.generateBearer() });
});

router.post('/token', (req, res, next) => {
  const token = cache.get(req.body.token);
  cache.del(req.body.token); // remove the key (one use)
  if (!token) {
    return next(401);
  }
  res.status(200).json({ token });
});

router.get('/', root);
router.get('/fail', (req, res, next) => next(401));
router.get('/callback', callback, (req, res) => {
  const token = uuid();
  cache.set(token, req.user.token);
  res.redirect(process.env.JSBIN + '?token=' + token);
  cache.prune(); // take a moment to clean up
});
