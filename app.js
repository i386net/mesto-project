require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT, DB_HOST, WEB_HOST } = process.env;

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '5f0076239de148b63ec37d15', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${WEB_HOST}:${PORT}`);
  console.log('Сервер БД работает по адресу:', '\x1b[32m\x1b[4m', `${DB_HOST}`);
});
