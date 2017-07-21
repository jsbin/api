const express = require('express');
const undefsafe = require('undefsafe');
const { get: getBin } = require('../../bin');
const { urlToPath } = require('../helpers/url');
const router = express.Router();
module.exports = router;

router.get('/:id', (req, res) => {
  res.status(404).jsonp({
    error: 'not found',
    hint: `To load the latest, use ${req.originalUrl}/latest`
  });
});

router.get(['/:id/:rev', '/:id/:rev/*'], (req, res, next) => {
  let { rev, id } = req.params;

  getBin({
    id,
    rev
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
