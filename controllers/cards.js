const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = new BadRequestError('Неправильные параметры карточки!');
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndDelete(card._id)
          .orFail(() => next(new NotFoundError('Карточка с таким id не найдена!')))
          .then((deletedCard) => res.send({ data: deletedCard, message: 'Карточка успешно удалена' }))
          .catch(() => next(new NotFoundError('Карточка с таким id не найдена!')));
      }
      return next(new ForbiddenError('Вы не можете удалять чужие карточки!'));
    })
    .catch(() => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => next(new NotFoundError(`Карточка с _id ${req.params.cardId} не найдена`)));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
