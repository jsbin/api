module.exports = (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  });

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
};
