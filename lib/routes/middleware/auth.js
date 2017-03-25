const jwt = require('jsonwebtoken');
// const User = require('../../db/user');

// authenticate the user based on the header: `Authorization: <key>`
module.exports = (req, res, next) => {
  if (req.user) {
    return next();
  }

  const auth = req.headers.authorization;
  const [scheme, token] = (auth || '').split(' ', 2).map(_ => _.trim());

  let promise;

  if (!auth) {
    return next();
  }

  if (scheme.toLowerCase() === 'token') {
    promise = Promise.resolve(token).then(apikey => {
      res.locals.apikey = apikey;
      return User.findOne({ apikey });
    });
  } else if (scheme.toLowerCase() === 'bearer') {
    promise = Promise.resolve(token).then(token => {
      const decoded = jwt.decode(token);

      if (!decoded) {
        return;
      }

      return User.findOne({ publicId: decoded.id }).then(user => {
        if (user) {
          jwt.verify(token, user.apikey); // if jwt has expired, it will throw
          res.locals.restricted = decoded.path;
        }
        return user;
      }).catch(e => {
        const error = new Error(e.message);
        error.code = 412;
        throw error;
      });
    });
  } else {
    return next({
      code: 400,
      message: `Authorization scheme (${scheme}) is not supported`
    });
  }

  promise.then(user => {
    if (!user) {
      return next({
        code: 412,
        message: 'Invalid auth token provided',
      });
    }
    req.user = user;
    res.locals.fromAPI = true;
    delete req.session;
    return next();
  }).catch(next);
};
