const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const router = express.Router();
module.exports = router;

router.use((req, res, next) => {
  req.user
    .getCustomer()
    .then(customer => {
      res.locals.customer = customer;
      next();
    })
    .catch(next);
});

router.get('/', (req, res, next) => {
  // user requires customer to be loaded

  return stripe.invoices
    .list({
      customer: res.locals.customer.stripeId,
      limit: 100,
    })
    .then(invoices => {
      res.json(
        invoices.data.map(invoice => ({
          id: invoice.id,
          date: invoice.date * 1000,
          start: invoice.period_start * 1000,
          end: invoice.period_end * 1000,
          total: invoice.total,
        }))
      );
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  stripe.invoices
    .retrieve(req.params.id)
    .then(invoice => {
      if (invoice.customer !== res.locals.customer.stripeId) {
        return next(401);
      }

      res.json(invoice);
    })
    .catch(next);
});
