const urlToArray = url => url.split('/').filter(Boolean);

const urlToPath = url => {
  const path = urlToArray(url).map(path => {
    if (path.includes('.') === false) {
      return `.${path}`;
    }

    return `["${path.replace(/"/g, '\\"')}"]`;
  }).join('').replace(/^\./, ''); // trim the first dot

  return path;
};

module.exports = {
  urlToArray,
  urlToPath,
};
