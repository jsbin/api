// 3rd party
const express = require('express');
const bodyParser = require('body-parser');
const timings = require('server-timings');
const favicon = require('serve-favicon');
const parse = require('url').parse;

// ours
require('@remy/envy'); // load local environment
require('./db'); // warm up the database
const logger = require('./logger');
const passport = require('./passport');
const drop = require('./routes/middleware/drop');
const routes = require('./routes');
const app = express();
const apiParsed = parse(process.env.API);
const port = process.env.PORT || apiParsed.port || 5000;

app.disable('x-powered-by');
app.set('json spaces', 2);

// app.use(compression);
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(drop);
app.use(timings);
app.use(logger);
app.use(bodyParser.json({ limit: '100kb' }));
app.use(passport.initialize());
// app.use(passport.session()); // disabled sessions

app.use(apiParsed.pathname, routes); // mount the router on API
app.use(require('./routes/middleware/error'));

if (module.parent) {
  module.exports = app;
} else {
  const server = app.listen(port, () => {
    console.log(
      `listening on http://localhost:${
        server.address().port
      } @ ${new Date().toJSON()}`
    );
  });
}
