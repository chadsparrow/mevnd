const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    req.member = jwt.verify(token, config.get('jwtPrivateKey'));
    next();
  } catch (err) {
    res.status(400).send('Access Denied. Invalid token.');
  }
};
