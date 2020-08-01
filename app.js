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
const { message } = require('./appdata/messages');

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
        'string.empty': message.emptyParam,
        'any.required': message.requiredParam,
        'string.email': message.emailNotValid,
      }),
    password: Joi.string().required()
      .messages({
        'any.required': message.requiredParam,
        'string.empty': message.emptyParam,
      }),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .pattern(/^[a-zA-Zа-яА-ЯёЁ -]*$/)
      .messages({
        'string.pattern.base': 'Имя должно быть строкой',
        'any.required': message.usernameRequired,
        'string.min': message.userNameMin,
        'string.max': message.userNameMax,
        'string.empty': message.userNameEmpty,
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': message.aboutRequired,
        'string.min': message.aboutMin,
        'string.max': message.aboutMax,
        'string.empty': message.aboutEmpty,
      }),
    avatar: Joi.string().pattern(urlRegexPattern).required()
      .messages({
        'string.pattern.base': message.incorrectURL,
        'any.required': message.avatarRequired,
        'string.empty': message.avatarEmpty,
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': message.requiredParam,
        'string.email': message.emailNotValid,
        'string.empty': message.emptyParam,
      }),
    password: Joi.string().alphanum()
      .min(8)
      .max(16)
      .required()
      .messages(
        {
          'any.required': message.requiredParam,
          'string.alphanum': message.passwordAlphaNum,
          'string.min': message.passwordMin,
          'string.max': message.passwordMax,
          'string.empty': message.emptyParam,
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
  const { statusCode = 500, message: errMessage } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : errMessage,
  });
});

app.listen(port, () => {
  console.log(`Веб сервер работает по адресу: ${webHost}:${port}`);
});
