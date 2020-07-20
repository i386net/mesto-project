require('dotenv').config();
const jwt = require('../appdata/imports');
// const { key } = require('../appdata/jwtdata');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return res.status(401).send({ error: 'Необходима авторизация!' });
  }
  req.user = payload;
  return next();
};
