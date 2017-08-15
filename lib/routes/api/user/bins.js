const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', (req, res, next) => {
  const limit = parseInt(req.query.limit || 50, 10);
  const page = parseInt(req.query.page || 1, 10) * limit - limit;

  req.user
    .getBins({
      where: { archived: false },
      offset: page,
      limit,
      order: [['id', 'DESC']],
    })
    .then(bins => {
      res.json(bins);
    })
    .catch(next);
});
