const mongoose = require('mongoose');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const deleteCard = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndDelete(req.params.cardId)
      .orFail(() => new Error(`Карточка с _id ${req.params.cardId} не найдена`))
      .then((card) => res.send({ data: card, message: 'Карточка удалена' }))
      .catch((err) => res.status(404).send({ error: err.message }));
  }
  return res.status(404).send({ error: 'Неверный формат id карточки' });
};

module.exports = { getCards, createCard, deleteCard };
