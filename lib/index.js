// 3rd party
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const timings = require('server-timings');
const parse = require('url').parse;

// ours
require('@remy/envy');

require('./db'); // warm up the database
const passport = require('./passport');

const app = express();
app.disable('x-powered-by');
app.set('json spaces', 2);

app.use(timings);
// app.use(compression);
app.use((req, res, next) => {
  const drop = ['/wp-login.php', '/wp-includes/'];

  if (drop.includes(req.url)) {
    return res.status(204).end();
  }
  next();
});

// app.use(favicon(__dirname + '/../public/favicon.ico'));

if (
  process.env.NODE_ENV !== 'test' ||
  (process.env.NODE_ENV === 'test' && process.env.VERBOSE)
) {
  logger.token('auth', req => req.headers.authorization);
  app.use(
    logger(':status :method :url :auth :response-time ms', {
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
    })
  );
}
// app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: '100kb',
  })
);

app.use(passport.initialize());
// app.use(passport.session()); // disabled sessions

/* error handler */
// app.use(require('./routes/error'));
app.use(parse(process.env.JSBIN).pathname, require('./routes')); // mount the router
app.use(require('./routes/middleware/error'));

app.locals.production = process.env.NODE_ENV === 'production';
app.locals.env = process.env;

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `listening on http://localhost:${
      server.address().port
    } @ ${new Date().toJSON()}`
  );
});
