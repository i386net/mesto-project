const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { urlRegexPattern } = require('../appdata/appdata');
const { idValidation, updateUserValidation, imageUrlValidation } = require('../middlewares/validation');
const {
  getUsers, getUser, updateAvatar, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().message('Некорректный формат id'),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.pattern.base': 'Имя должно быть строкой',
        'any.required': 'Имя обязательное поле',
        'string.min': 'В имени должно быть не менее {#limit} знаков',
        'string.max': 'В имени должно быть не более {#limit} знаков',
        'string.empty': 'Имя не может быть пустым',
      }),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'any.required': 'Информация обязательное поле',
        'string.min': 'Информация должна быть не менее {#limit} знаков',
        'string.max': 'Информация должна быть не более {#limit} знаков',
        'string.empty': 'Поле информации не может быть пустым',
      }),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .messages({
        'string.pattern.base': 'Некорректная ссылка',
        'any.required': 'Аватар обязательное поле',
        'string.empty': 'Аватар не может быть пустым',
      }),
  }),
}), updateAvatar);

module.exports = router;
