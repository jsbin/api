const drop = ['/wp-login.php', '/wp-includes/'];

module.exports = (req, res, next) => {
  if (drop.includes(req.url)) {
    return res.status(204).end();
  }
  next();
};
