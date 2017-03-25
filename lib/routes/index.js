const express = require('express');
const router = express.Router();
const api = require('./api');

module.exports = router;

router.use('/api/v2/', require('./middleware/auth'), api);
router.use('/api/', api);
router.get('/', (req, res) => res.jsonp(true));
