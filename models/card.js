const mongoose = require('mongoose');
const pattern = require('../appdata/pattern');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => url.test(pattern),
      message: 'Тут должна быть ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
