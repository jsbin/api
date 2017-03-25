const request = require('request').defaults({
  baseUrl: 'https://jsbin.com/api',
  json: true,
});

module.exports = {
  get,
};

function get({ id, rev }) {
  let url = `/${id}/`;

  if (rev !== 'latest' && parseInt(rev, 10) !== NaN) {
    url += rev;
  }

  return new Promise((resolve, reject) => {
    request({ url }, (error, res, body) => {
      if (error) {
        return reject(error);
      }

      if (res.statusCode === 200) {
        return resolve(body);
      }

      error = new Error(body.error); // hoping this is good
      error.code = res.statusCode;
      return reject(error);
    });
  });
}
