const express = require('express');
const router = express.Router();
const api = require('./api');
const mount = process.env.MOUNT || '';

module.exports = router;

router.use(mount, api);
router.use(`${mount}/v2/`, api);

// backup
router.get('/', (req, res) => res.jsonp({ message: 'JS Bin API' }));
