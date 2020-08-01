const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { urlRegexPattern } = require('../appdata/appdata');
const { message } = require('../appdata/messages');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': message.cardNameRequired,
        'string.min': message.nameMin,
        'string.max': message.nameMax,
        'string.empty': message.nameEmpty,
      }),
    link: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .messages({
        'string.pattern.base': message.incorrectURL,
        'any.required': message.urlRequired,
        'string.empty': message.emptyURL,
      }),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message(message.incorrectFormatID),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message(message.incorrectFormatID),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message(message.incorrectFormatID),
  }),
}), dislikeCard);

module.exports = router;
