// 3rd party
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const timings = require('server-timings');

// ours
const config = require('./config');

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
      }
    })
  );
}
// app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: '100kb'
  })
);

/* error handler */
// app.use(require('./routes/error'));
app.use('/', require('./routes')); // mount the router
app.use(require('./routes/middleware/error'));

app.locals.production = config.NODE_ENV === 'production';
app.locals.env = process.env;

const server = app.listen(process.env.PORT || 8000, () => {
  if (process.env.NODE_ENV === 'dev') {
    console.log(
      `listening on http://localhost:${server.address()
        .port} @ ${new Date().toJSON()}`
    );
  }
});
