const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
var exec = require('child_process').exec;
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const version = require(resolveApp('package.json')).version;

let rev = process.env.GIT_REV;

if (!rev) {
  command('git rev-parse HEAD').then(value => (rev = value));
}

module.exports = router;

router.get('/', (req, res) =>
  res.jsonp({
    api: 'v2',
    version,
    rev,
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
