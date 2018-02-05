const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
var exec = require('child_process').exec;
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const asSha = value => (value || '').substring(0, 7);
const version = require(resolveApp('package.json')).version;

let rev = asSha(process.env.GIT_REV);

if (!rev) {
  command('git rev-parse HEAD').then(value => (rev = asSha(value)));
}

module.exports = router;

router.get('/', (req, res) =>
  res.jsonp({
    version,
    rev,
    url: `https://github.com/jsbin/output/commit/${rev}`,
  })
);

function command(cmd) {
  return new Promise(resolve => {
    exec(cmd, { cwd: appDirectory }, (err, stdout, stderr) => {
      var error = stderr.trim();
      if (error) {
        return resolve('unknown');
      }
      resolve(stdout.split('\n').join(''));
    });
  });
}
