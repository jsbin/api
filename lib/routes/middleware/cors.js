module.exports = (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization',
  });

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
};
