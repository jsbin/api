const logger = require('morgan');

if (
  process.env.NODE_ENV !== 'test' ||
  (process.env.NODE_ENV === 'test' && process.env.VERBOSE)
) {
  logger.token('auth', req => req.headers.authorization);
  module.exports = logger(':status :method :url :auth :response-time ms', {
    // only log errors
    skip: (req, res) => {
      if (res.statusCode < 400) {
        return true;
      }
      if (res.statusCode === 404) {
        return true;
      }

      return false;
    },
  });
} else {
  module.exports = (req, res, next) => next();
}
