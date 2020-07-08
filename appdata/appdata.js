const DB_HOST = 'mongodb://localhost:27017/mestodb';
const PORT = '3000';
const WEB_HOST = 'http://localhost';
const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  connectTimeoutMS: 0,
};
const urlValidationOptions = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: true,
  allow_trailing_dot: false,
};

module.exports = {
  urlValidationOptions, dbOptions, DB_HOST, PORT, WEB_HOST,
};
