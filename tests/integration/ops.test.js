const fs = require('fs');
const db = require('../../lib/db');
const { op, setup, _request: request } = require('./utils');
let user = null;

beforeAll(() => {
  return db.sync().then(() =>
    setup({}).then(u => {
      console.log('user', user);
      user = u;
    })
  );
});

const dir = __dirname + '/operations/';
const tests = fs
  .readdirSync(dir)
  .filter(_ => {
    if (process.env.TEST) {
      // support for testing a single op
      return _.includes(process.env.TEST);
    }
    return true;
  })
  .reduce((acc, file) => {
    const [id] = file.split('.');
    acc[id] = op(dir + file);
    return acc;
  }, {});

Object.keys(tests).forEach(id => {
  test(tests[id].name || `issue #${id}`, t => {
    const expected = tests[id].expect;
    const include = tests[id].include;
    const tokens = {
      token: user.apiKey,
      bearer: user.generateBearer(),
    };

    const requests = tests[id].op.reduce((acc, op) => {
      if (op.headers.authorization) {
        const [scheme] = op.headers.authorization.split(' ');
        op.headers.authorization = scheme + ' ' + tokens[scheme];
      }

      return acc.then(() =>
        request({
          url: op.url,
          headers: op.headers,
          method: op.method,
          body: op.body,
        }).then(res => {
          expect(res.statusCode).toBeLessThan(300);
          if (res.statusCode === 500) {
            throw new Error(res.body);
          }
          return res;
        })
      );
    }, Promise.resolve());

    return requests
      .then(res => {
        if (res.req.method === 'GET') {
          if (res.headers['content-type'].includes('application/json')) {
            return JSON.parse(res.body);
          }
          return res.body;
        }
        return t.fail('Only GET currently supported');
      })
      .then(store => {
        if (include) {
          expect(store).toMatch(include);
        } else {
          expect(store).toEqual(expected);
        }
      });
  });
});
