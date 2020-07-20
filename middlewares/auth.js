const jwt = require('jsonwebtoken');
const { key } = require('../appdata/jwtdata');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return res.status(401).send({ error: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};
