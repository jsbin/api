const express = require('express');
const router = express.Router();
module.exports = router;

router.use(require('../middleware/cors'));
router.use(require('../middleware/auth'));

router.get('/', require('./version'));
router.use('/auth', require('./auth'));
router.use('/bin', require('./bin'));
router.use('/user', require('./user'));
