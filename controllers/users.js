const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  return res.status(400).send({ error: 'Неверный формат id пользователя' });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message });
      }
      return res.status(500).send({ error: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message });
      }
      return res.status(500).send({ error: err.message });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message });
      }
      return res.status(500).send({ error: err.message });
    });
};

const login = (req, res, next) => {
  next();
  return { req, res };
};

module.exports = {
  getUsers, getUser, createUser, updateAvatar, updateUser, login,
};
