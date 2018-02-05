const express = require('express');
const { root, callback } = require('../../passport/github');
const requireUser = require('../middleware/require-user');
const router = express.Router();

module.exports = router;

router.get('/refresh', requireUser, (req, res) => {
  res.json({ token: req.user.generateBearer() });
});

router.get('/', root);
router.get('/fail', (req, res, next) => next(401));
router.get('/callback', callback, (req, res) => {
  res.redirect(process.env.JSBIN + '?token=' + req.user.generateBearer());
});
