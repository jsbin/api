const express = require('express');
const { root, callback } = require('../../strategy/github');
const router = express.Router();

module.exports = router;

router.get('/', root);
router.get('/fail', (req, res, next) => next(401));
router.get('/callback', callback, (req, res) => {
  console.log(req.user);
  res.redirect(process.env.JSBIN + '?token=' + req.user.generateBearer());
});
