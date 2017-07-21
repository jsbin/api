module.exports = (req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization'
  });
  next();
};
