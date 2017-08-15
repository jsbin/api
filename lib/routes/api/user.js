const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', (req, res) => res.json(req.user.get({ plain: true })));
router.get('/invoice/:id', (req, res) =>
  res.json({
    id: req.params.id,
    receipt_number: '#2039-1660',
    date: '2017-08-15',
    lines: {
      data: [
        {
          plan: { name: 'Pro yearly', interval: 'year' },

          amount: 6000,
        },
      ],
    },
  })
);
router.get('/bins', (req, res) => res.json([]));
