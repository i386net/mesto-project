const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { DB_HOST, PORT, WEB_HOST } = require('./appdata/appdata');

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

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Веб сервер работает по адресу: ${WEB_HOST}:${PORT}`);
  console.log(`Сервер БД работает по адресу: ${DB_HOST}`);
});
