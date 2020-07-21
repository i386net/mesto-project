const dbHost = 'mongodb://localhost:27017/mestodb';
const port = '3000';
const webHost = 'http://localhost';
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
const emailValidationOptions = {
  require_tld: true,
};

module.exports = {
  emailValidationOptions, urlValidationOptions, dbOptions, dbHost, port, webHost,
};
