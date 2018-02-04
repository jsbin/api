const fs = require('fs');
const _request = require('./request-then');
const User = require('../../lib/db/user');
const Bin = require('../../lib/db/bin');
const parsed = require('url').parse(process.env.API);
// "test" is the username
const root = `${parsed.protocol}//${parsed.host}`;
const base = `${root}${parsed.pathname}`;

module.exports = {
  setup,
  updateUser,
  request,
  base,
  _request,
  op,
};

function request(
  user,
  { method = 'get', url = base, body = {}, json = true } = {}
) {
  return _request({
    method,
    body,
    url,
    json,
    headers: {
      authorization: `token ${user.apiKey}`,
    },
  }).then(res => res.body);
}

function setup() {
  let user = null;
  const p1 = User.destroy({ where: { username: 'test' } }).then(() => {
    return User.create({
      apiKey: '123456789kajd',
      githubId: 1,
      email: null,
      username: 'test',
    }).then(u => (user = u));
  });

  const p2 = Bin.destroy({ where: { url: 'canvas' } }).then(() => {
    const bin = {
      url: 'canvas',
      revision: 1,
      javascript: '// 1',
      html: '<html></html>',
      css: '* {}',
    };
    return Promise.all([
      Bin.create(bin),
      Bin.create({ ...bin, revision: 2, javascript: '// 2' }),
    ]);
  });

  return Promise.all([p1, p2]).then(() => user);
}

function updateUser({ username }) {
  return User.findOne({ where: { username } });
}

function op({ file, root = '' }) {
  let index = -1;
  const requests = [];
  const config = {
    setup: '',
    expect: '',
    name: '',
    include: '',
  };

  const lines = fs.readFileSync(file, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line[0] === '+') {
      // slurp blank lines and the body
      const type = line
        .trim()
        .slice(1)
        .trim();
      i++;
      while ((line = lines[i].trim())) {
        config[type] += line;
        i++;
      }
      continue;
    }

    if (line === '') {
      continue;
    }

    if (line.startsWith('//')) {
      // comment
      continue;
    }

    if (line.startsWith('# ')) {
      let [, method, url] = line.split(' ');
      index++;
      requests[index] = {
        method,
        url: root + url,
        headers: {},
      };
      continue;
    }

    if (line.toLowerCase() === 'headers:') {
      i++;
      while ((line = lines[i].trim())) {
        const parts = line.split(':');
        requests[index].headers[parts[0].trim().toLowerCase()] = parts
          .slice(1)
          .join(':')
          .trim();
        i++;
      }
      continue;
    }

    requests[index].body = line;
  }

  const setup = new Function('return ' + (config.setup || 'null'))();
  const expect = new Function('return ' + (config.expect || 'null'))();
  const include = new Function('return ' + (config.include || 'null'))();

  return { name: config.name, setup, expect, include, op: requests };
}
