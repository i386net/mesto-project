const mongoose = require('mongoose');
const pattern = require('../appdata/pattern');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => {
        pattern.test(url);
      },
      message: 'Тут должна быть ссылка',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
