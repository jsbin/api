const LRU = require('lru-cache');
const options = {
  max: 500,
};
const cache = LRU(options);

const request = require('request').defaults({
  baseUrl: 'https://jsbin.com/api',
  json: true,
});

module.exports = {
  get,
  create,
};

function create() {}

function get({ id, rev }) {
  let url = `/${id}/`;

  if (rev !== 'latest' && !isNaN(rev)) {
    url += rev;
  }

  return new Promise((resolve, reject) => {
    const cached = cache.get(url);
    if (cached) {
      resolve(cached);
      return;
    }
    request({ url }, (error, res, body) => {
      if (error) {
        return reject(error);
      }

      if (res.statusCode === 200) {
        cache.set(url, body);
        return resolve(body);
      }

      error = new Error(body.error); // hoping this is good
      error.code = res.statusCode;
      return reject(error);
    });
  });
}
