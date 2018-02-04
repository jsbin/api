const LRU = require('lru-cache');
const Bin = require('./db/bin');
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

function create(bin) {
  return Bin.create(bin);
}

function get({ id: url, rev: revision }) {
  let key = `/${url}/`;

  if (revision !== 'latest' && !isNaN(revision)) {
    key += revision;
  }

  const cached = cache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }

  let promise;

  if (revision !== 'latest') {
    promise = Bin.find({
      where: {
        url,
        revision,
        active: 'y',
      },
    });
  } else {
    promise = Bin.findAll({
      where: {
        url,
        active: 'y',
      },
      order: [['revision', 'DESC']],
      limit: 1,
    }).then(bins => bins.pop());
  }

  return promise.then(bin => {
    if (!bin) {
      const error = new Error('Not found');
      error.code = 404;
      throw error;
    }

    cache.set(url, bin);

    // TODO validate again private

    return bin;
  });
}

function getDirect({ id, rev }) {
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
