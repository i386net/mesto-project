const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(
      new Error(`Пользователь с ${req.params.userId} не найден`)
    );
    return res.json({ user });
  } catch (err) {
    return res.status(404).send({ message: err.message });
  }
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports = { getUsers, getUser, createUser };
