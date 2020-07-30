const { Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { urlRegexPattern } = require('../appdata/appdata');
const { BadRequestError } = require('../errors/BadRequestError');

const regValidation = {
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30),
    about: Joi.string()
      .required()
      .min(2)
      .max(30),
    avatar: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .error(() => new BadRequestError('Некорректная ссылка')),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .alphanum()
      .uppercase()
      .lowercase()
      .min(8)
      .max(16),
  }),
};
const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(() => new BadRequestError('Ваш email не похож на email')),
    password: Joi.string()
      .required()
      .alphanum()
      .uppercase()
      .lowercase()
      .min(8)
      .max(16)
      .error(() => new BadRequestError('Введите нормальный пароль!')),
  }),
};
const idValidation = {
  params: Joi.object().keys({
    userId: Joi.objectId()
      .error(() => new BadRequestError('Неверный формат id')),
  }),
};
const updateUserValidation = {
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30),
    about: Joi.string()
      .required()
      .min(2)
      .max(30),
  }),
};
const imageUrlValidation = {
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .error(() => new BadRequestError('Некорректная ссылка')),
  }),
};
module.exports = {
  regValidation, loginValidation, idValidation, updateUserValidation, imageUrlValidation,
};
