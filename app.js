const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const colors = require('colors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  dbOptions, dbHost, port, webHost,
} = require('./appdata/appdata');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(dbHost, dbOptions)
  .then(() => console.log('Соединение с БД установлено:', colors.blue(dbHost)))
  .catch((err) => console.log('Ошибка соединения с БД:'.red, err.message));
app.use(requestsLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorsLogger);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(port, () => {
  console.log(`Веб сервер работает по адресу: ${webHost}:${port}`);
});
