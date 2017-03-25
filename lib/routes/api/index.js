const express = require('express');
const router = express.Router();
const version = require(__dirname + '/../../../package.json').version
module.exports = router;

router.get('/', (req, res) => res.jsonp({
  api: 'v2',
  version,
}));

router.use('/bin', require('./bin'));
