const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const version = require(resolveApp('package.json')).version;

const requireUser = require('../middleware/require-user');
module.exports = router;

router.use(require('../middleware/auth'));
router.use(require('../middleware/cors'));

router.get('/', (req, res) =>
  res.jsonp({
    api: 'v2',
    version,
  })
);

router.use('/auth', require('./auth'));
router.use('/bin', require('./bin'));
router.use('/user', requireUser, require('./user'));
