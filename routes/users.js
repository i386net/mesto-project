const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { urlRegexPattern } = require('../appdata/appdata');
const { message } = require('../appdata/messages');
const {
  getUsers, getUser, updateAvatar, updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().message(message.incorrectFormatID),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.pattern.base': message.userNameString,
        'any.required': message.usernameRequired,
        'string.min': message.userNameMin,
        'string.max': message.userNameMax,
        'string.empty': message.userNameEmpty,
      }),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'any.required': message.aboutRequired,
        'string.min': message.aboutMin,
        'string.max': message.aboutMax,
        'string.empty': message.aboutEmpty,
      }),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .messages({
        'string.pattern.base': message.incorrectURL,
        'any.required': message.avatarRequired,
        'string.empty': message.avatarEmpty,
      }),
  }),
}), updateAvatar);

module.exports = router;
