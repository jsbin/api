const ua = require('universal-analytics');
const anon = '00000000-0000-0000-0000-000000000000';

module.exports = (req, res, next) => {
  // this is incomplete, but a good start
  if (process.env.ANALYTICS) {
    const id = req.user ? req.user.longId : anon;

    ua(process.env.ANALYTICS, id, {
      https: true
    }).pageview(req.originalUrl).send();
  }

  next();
}

// module.exports = startAnalyics;
