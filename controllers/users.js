const PasswordValidator = require('password-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { key } = require('../appdata/jwtdata');
const { validationErrorHandling } = require('../middlewares/errhandling');

const passwordSchema = new PasswordValidator();
passwordSchema
  .is().min(8)
  .is().max(16)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

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
    name, about, avatar, email, password,
  } = req.body;
  if (!password) return res.status(400).send({ error: 'Пароль - обязательное поле.' });
  if (!passwordSchema.validate(password)) {
    return res.status(400).send({ error: 'Пароль должен быть от 8 до 16 знаков, содержать цифры, заглавные и прописные буквы.' });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.email.kind === 'unique') {
          return res.status(409).send({ error: err.message });
        }
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
    .catch((err) => validationErrorHandling(err, res));
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
    .catch((err) => validationErrorHandling(err, res));
};

const login = (req, res) => {
  if (!req.body.email) return res.status(400).json({ error: 'Поле Email должно быть заполнено' });
  if (!req.body.password) return res.status(400).json({ error: 'Поле пароль должно быть заполнено' });
  return User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      }).end();
    })
    .catch((err) => res.status(401).send({ error: err.message }));
};

module.exports = {
  getUsers, getUser, createUser, updateAvatar, updateUser, login,
};
