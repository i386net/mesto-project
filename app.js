require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const colors = require('colors');
const mongoose = require('mongoose');
const { celebrate, errors, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const {
  dbOptions, dbHost, port, webHost, urlRegexPattern,
} = require('./appdata/appdata');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestsLogger, errorsLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

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

// -- Краш-тест --
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// -- Краш-тест --

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.empty': 'Адрес электронной почты не может быть пустым',
        'any.required': 'Это обязательное поле',
        'string.email': 'Данный адрес не является электронной почтой',
      }),
    password: Joi.string().required().alphanum().uppercase()
      .lowercase()
      .min(8)
      .max(16)
      .messages({
        'any.required': 'Это обязательное поле',
        'string.empty': 'Пароль не может быть пустым',
      }),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[a-zA-Zа-яА-ЯёЁ -]*$/)
      .messages({
        'string.pattern.base': 'Имя должно быть строкой',
        'any.required': 'Имя обязательное поле',
        'string.min': 'В имени должно быть не менее {#limit} знаков',
        'string.max': 'В имени должно быть не более {#limit} знаков',
        'string.empty': 'Имя не может быть пустым',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Информация обязательное поле',
        'string.min': 'Информация должна быть не менее {#limit} знаков',
        'string.max': 'Информация должна быть не более {#limit} знаков',
        'string.empty': 'Поле информации не может быть пустым',
      }),
    avatar: Joi.string().pattern(urlRegexPattern).required()
      .messages({
        'string.pattern.base': 'Не является ссылкой',
        'any.required': 'Аватар обязательное поле',
        'string.empty': 'Аватар не может быть пустым',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Почта обязательное поле',
        'string.email': 'Данный адрес не является электронной почтой',
        'string.empty': 'Почта не может быть пустой',
      }),
    password: Joi.string().alphanum()
      .min(8)
      .max(16)
      .required()
      .messages(
        {
          'any.required': 'Пароль обязательное поле',
          'string.alphanum': 'Пароль должен содержать буквы и/или цифры',
          'string.min': 'В пароле должно быть не менее {#limit} знаков',
          'string.max': 'В пароле должно быть не более {#limit} знаков',
          'string.empty': 'Пароль не может быть пустым',
        },
      ),
  }),
}), createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorsLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден.'));
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
