const mongoose = require('mongoose');
const validator = require('validator');
const { urlValidationOptions } = require('../appdata/appdata');

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
      validator: (email) => validator.isEmail(email),
      message: (props) => `${props.value} некорректная почта`,
    },
  },
  password: {},
});

module.exports = mongoose.model('user', userSchema);
