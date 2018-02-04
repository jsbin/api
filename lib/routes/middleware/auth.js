const jwt = require('jsonwebtoken');
const User = require('../../db/user');

// authenticate the user based on the header: `Authorization: <key>`
module.exports = (req, res, next) => {
  if (req.user) {
    return next();
  }

  if (req.method === 'OPTIONS') {
    return next();
  }

  const auth = req.headers.authorization;
  let [scheme, token] = (auth || '').split(' ', 2).map(_ => _.trim());

  if (!auth) {
    // try the query string (when user is saving on OPTION request)
    if (req.query.bearer) {
      scheme = 'bearer';
      token = req.query.bearer;
    }

    if (req.query.token) {
      scheme = 'token';
      token = req.query.token;
    }
  }

  let promise;

  if (!token) {
    return next();
  }

  if (scheme.toLowerCase() === 'token') {
    promise = Promise.resolve(token).then(apiKey => {
      res.locals.apiKey = apiKey;
      return User.findOne({ where: { apiKey } });
    });
  } else if (scheme.toLowerCase() === 'bearer') {
    promise = Promise.resolve(token).then(token => {
      const decoded = jwt.decode(token);

      if (!decoded) {
        return;
      }

      return User.findOne({ where: { username: decoded.username } })
        .then(user => {
          if (!user) {
            throw new Error('bad token');
          }
          if (user) {
            jwt.verify(token, process.env.JWT_SECRET); // if jwt has expired, it will throw
          }
          return user;
        })
        .catch(e => {
          const error = new Error(e.message);
          error.code = 401;
          throw error;
        });
    });
  } else {
    return next({
      code: 400,
      message: `Authorization scheme (${scheme}) is not supported`,
    });
  }

  promise
    .then(user => {
      if (!user) {
        return next({
          code: 401,
          message: 'Invalid auth token provided',
        });
      }
      req.user = user;
      res.locals.fromAPI = true;
      delete req.session;
      return next();
    })
    .catch(next);
};
