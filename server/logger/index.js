const { createLogger, format, transports } = require('winston');
const { timestamp, json } = format;

const loggerSettings = {
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/main.log'
    })
  ],
  format: format.combine(
    timestamp(),
    json()
  )
};

const logger = createLogger(loggerSettings);

module.exports = {
  logger,
  loggerSettings
};
