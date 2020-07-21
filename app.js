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

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(dbHost, dbOptions)
  .then(() => console.log('Соединение с БД установлено:', colors.blue(dbHost)))
  .catch((err) => console.log('Ошибка соединения с БД:'.red, err.message));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(port, () => {
  console.log(`Веб сервер работает по адресу: ${webHost}:${port}`);
});
