const mongoose = require('mongoose');
const Card = require('../models/card');
const { cardNotFoundErrHandling } = require('../middlewares/errhandling');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // todo удалить эти комментарии
      // if (err.name === 'ValidationError') {
      //   return res.status(400).send({ error: err.message });
      // }
      // return res.status(500).send({ error: err.message });
      let error;
      if (err.name === 'ValidationError') {
        error = new BadRequestError('Неправильные параметры карточки!');
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return Card.findById(req.params.cardId)
      .orFail() // () => new Error(`Карточка с _id ${req.params.cardId} не найдена`)
      .then((card) => {
        if (card.owner.toString() === req.user._id) {
          return Card.findByIdAndDelete(card._id)
            .orFail(() => new Error('С удалением что-то пошло не так'))
            .then((deletedCard) => res.send({ data: deletedCard, message: 'Карточка успешно удалена' }))
            .catch((err) => next(new NotFoundError('Карточка с таким id не найдена!')));
        }
        return res.status(403).send({ error: 'Вы не можете удалять чужие карточки' });
      })
      .catch((err) => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
  }
  return res.status(400).send({ error: 'Неверный формат id карточки' });
};

const likeCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then((card) => res.send({ data: card }))
      .catch((err) => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
  }
  return res.status(400).send({ error: 'Неверный формат id карточки' });
};

const dislikeCard = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail()
      .then((card) => res.send({ data: card }))
      .catch((err) => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
  }
  return res.status(400).send({ error: 'Неверный формат id карточки' });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
