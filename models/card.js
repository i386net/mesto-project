const mongoose = require('mongoose');
// const pattern = require('../appdata/pattern');
const validator = require('validator');
const { options } = require('../appdata/appdata');

// const options = {
//   protocols: ['http', 'https'],
//   require_protocol: true,
//   require_host: true,
//   require_valid_protocol: true,
//   allow_underscores: true,
//   allow_trailing_dot: false,
// };

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
      validator: (url) => validator.isURL(url, options),
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
