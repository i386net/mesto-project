const jwt = require('jsonwebtoken');

const key = 'secret-key'; // todo remove hardcoded key

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('Необходима авторизация');
  }
  const token = authorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return res.status(401).send('Пароль не подходит');
  }
  req.user = payload;
  return next();
};
