const express = require('express');
const undefsafe = require('undefsafe');
const pick = require('lodash.pick');
const requireUser = require('../middleware/require-user');
const { get: getBin, create: createBin } = require('../../bin');
const { urlToPath } = require('../helpers/url');
const router = express.Router();
module.exports = router;

router.post('/', requireUser, (req, res, next) => {
  // create a bin
  const bin = pick(req.body, [
    'html',
    'css',
    'javascript',
    'settings',
    'description',
    'title',
  ]);
  createBin(bin)
    .then(body => res.json({ id: body.url }))
    .catch(next);
});

// also requires ownership
router.patch('/:id', requireUser, (req, res) => {
  const bin = pick(req.body, [
    'html',
    'css',
    'javascript',
    'settings',
    'description',
    'title',
  ]);
  // update a bin
  res.json(bin);
});

router.get('/:id', (req, res) => {
  res.status(404).jsonp({
    error: 'not found',
    hint: `To load the latest, use ${req.originalUrl}/latest`,
  });
});

// note: the * on /id/rev allows for deep linking: /canvas/latest/javascript
router.get(['/:id/:rev', '/:id/:rev/*'], (req, res, next) => {
  let { rev, id } = req.params;

  getBin({
    id,
    rev,
  })
    .then(body => {
      let result = body;
      if (req.params[0]) {
        // partial object request
        result = undefsafe(body, urlToPath(req.params[0]));
      }

      res.status(200).jsonp(result);
    })
    .catch(next);
});
