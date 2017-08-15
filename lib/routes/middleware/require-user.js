module.exports = (req, res, next) => {
  if (!req.user) {
    return next(401);
  }
  next();
};
