const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { urlValidationOptions, emailValidationOptions } = require('../appdata/appdata');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина имени 2 символа'],
    maxlength: [30, 'Максимальная длина имени 30 символов'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url, urlValidationOptions),
      message: (props) => `${props.value} некорректная ссылка`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email, emailValidationOptions),
      message: (props) => `${props.value} некорректная почта`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Минимальная длина пароля 8 символов'],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Wrong email or password'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject((new Error('Wrong email or password')));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
