const express = require('express');
const undefsafe = require('undefsafe');
const slugger = require('jsbin-id');
const requireUser = require('../middleware/require-user');
const { get: getBin } = require('../../bin');
const { urlToPath } = require('../helpers/url');
const router = express.Router();
module.exports = router;

router.post('/', requireUser, (req, res) => {
  // create a bin
  res.json({ id: slugger() });
});

// also requires ownership
router.patch('/:id', requireUser, (req, res) => {
  // update a bin
  res.json(true);
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
