const mongoose = require('mongoose');
const pattern = require('../appdata/pattern');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина имени 2 символа'],
    maxlength: [30, 'Максимальная длина имени 30 символов'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => pattern.test(url),
      message: (props) => `${props.value} некорректная ссылка`,
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
