const express = require('express');
const router = express.Router();
const api = require('./api');

module.exports = router;

router.use('/', api);
router.use('/v2/', api);
