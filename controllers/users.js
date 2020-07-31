const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { key } = require('../appdata/jwtdata');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { BadRequestError } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return User.findById(req.params.userId)
      .orFail()
      .then((user) => res.send({ data: user }))
      .catch(() => next(new NotFoundError(`Пользователь с таким _id ${req.params.userId} не найден!`)));
  }
  return next(new BadRequestError('Неверный формат id пользователя'));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
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
      let error;
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          error = new ConflictError('Этот логин занят');
          return next(error);
        }
        error = new BadRequestError('Переданы некорректные данные');
      }
      return next(error);
    });
};

const updateUser = (req, res, next) => {
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
    .catch(() => next(new BadRequestError('Переданы некорректные данные')));
};

const updateAvatar = (req, res, next) => {
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
    .catch(() => next(new BadRequestError('Переданы некорректные данные')));
};

const login = (req, res, next) => User.findUserByCredentials(req.body.email, req.body.password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
    })
      .send({ message: 'Добро пожаловать <(￣︶￣)>' })
      .end();
  })
  .catch(() => next(new UnauthorizedError('Ошибка авторизации (×﹏×)')));
module.exports = {
  getUsers, getUser, createUser, updateAvatar, updateUser, login,
};
