const request = require('supertest');
const app = require('../../lib/server');

const fs = require('fs');
const db = require('../../lib/db');
const { op, setup } = require('./utils');
let user = null;

beforeAll(() => {
  return db
    .sync()
    .then(() => setup({}))
    .then(u => {
      user = u;
    })
    .catch(e => {
      expect(e).toBe(false);
    });
});

afterAll(() => {
  db.close();
});

const dir = __dirname + '/operations/';
const tests = fs
  .readdirSync(dir)
  .filter(_ => {
    if (process.env.TEST) {
      // support for testing a single op
      return _.includes(process.env.TEST);
    }

    // support ignoring files starting with `-`
    return !_.startsWith('-');
  })
  .reduce((acc, file) => {
    const [id] = file.split('.');
    acc[id] = op({ file: dir + file });
    return acc;
  }, {});

Object.keys(tests).forEach(id => {
  test(tests[id].name || `issue #${id}`, () => {
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

      return acc.then(() => {
        const { headers, body, url } = op;
        const method = op.method.toLowerCase();

        let req = request(app)[method](url);

        if (body) {
          req = req.type('form').send(body);
        }

        for (let [key, value] of Object.entries(headers)) {
          req = req.set(key, value);
        }

        return req.then(res => {
          expect(res.statusCode).toBeLessThan(300);
          if (res.statusCode === 500) {
            throw new Error(res.body);
          }
          return res.body;
        });
      });
    }, Promise.resolve());

    return requests.then(store => {
      if (include) {
        expect(store).toEqual(expect.objectContaining(include));
      } else {
        expect(store).toEqual(expected);
      }
    });
  });
});
