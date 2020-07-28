const winston = require('winston');
const expressWinston = require('express-winston');
const moment = require('moment-timezone');

const loggerFormat = winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${JSON.stringify(info.meta)}`);
const convertTimeZone = winston.format((info, opts) => {
  if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
  return info;
});
const requestsLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: './logs/requests.log' })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
  level: 'info',
});

const errorsLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: './logs/errors.log' })],
  format: winston.format.combine(
    convertTimeZone({ tz: 'Europe/Moscow' }),
    loggerFormat,
  ),
  level: 'error',
});

module.exports = { requestsLogger, errorsLogger };
