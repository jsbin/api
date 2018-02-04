const express = require('express');
const requireUser = require('../../middleware/require-user');

const router = express.Router();
module.exports = router;

router.use(requireUser); // secure all routes

router.get('/', (req, res) => {
  res.json({
    ...req.user.get({ plain: true }),
    token: req.user.generateBearer(),
  });
});
router.use('/invoice', require('./invoice'));
router.use('/bins', require('./bins'));
