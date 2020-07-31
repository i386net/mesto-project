const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { urlRegexPattern } = require('../appdata/appdata');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Название карточки обязательное поле',
        'string.min': 'Название должно быть не менее {#limit} знаков',
        'string.max': 'Название должно быть не более {#limit} знаков',
        'string.empty': 'Название не может быть пустым',
      }),
    link: Joi.string()
      .pattern(urlRegexPattern)
      .required()
      .messages({
        'string.pattern.base': 'Некорректная ссылка',
        'any.required': 'Ссылка обязательное поле',
        'string.empty': 'Ссылка не может быть пустой',
      }),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message('Некорректный формат id'),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message('Некорректный формат id'),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().message('Некорректный формат id'),
  }),
}), dislikeCard);

module.exports = router;
