const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

const getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return User.findById(req.params.userId)
      .orFail(
        () => new Error(`Пользователь с таким _id ${req.params.userId} не найден`),
      )
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(404).send({ error: err.message }));
  }
  return res.status(404).send({ error: 'Неверный формат id' });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

module.exports = { getUsers, getUser, createUser };
