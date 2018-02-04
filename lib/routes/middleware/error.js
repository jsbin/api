const codes = require('http-status-codes');
const undefsafe = require('undefsafe');

module.exports = (error, req, res, next) => {
  // eslint-disable-line
  let message = null;
  let n;

  if (typeof error === 'number') {
    n = error;
    error = new Error(codes.getStatusText(error));
    error.code = n;
  }
  message = error.message || codes.getStatusText(n);

  // Ensure we send the correct type of http status, if there's a real error
  // then the `error.code` will be a string, override with 500
  // 500, General error:

  const status = error.code || 500;
  if (typeof status === 'string') {
    status = 500;
  }

  // prepare the error page shown to the user
  const e = {
    message,
    status,
  };

  if (status === 401) {
    if (res.locals.apiKey) {
      return res.status(401).json({
        status,
        message: message + ' (bad api token)',
      });
    }

    // return res.status(401).set('location', '/login').render('redirect', {
    //   layout: false,
    //   host: process.env.HOST,
    // });
  }

  let msg = `${status} ${req.url} `;
  if (req.user) {
    msg += `${req.user.username} `;
  }
  msg += message;

  if (process.env.NODE_ENV !== 'test') {
    console.error(
      req.url,
      undefsafe(req, 'user.apiKey') || req.headers.authorization,
      (error.stack || msg)
        .split('\n')
        .filter(_ => !_.includes('node_modules'))
        .join('\n')
    );
  }

  res.status(status).jsonp(e);
};
