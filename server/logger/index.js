const { createLogger, format, transports } = require('winston');
const { timestamp, colorize, printf, json } = format;

const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logLevels = {
  info: 0,
  warn: 1,
  error: 2,
  upload: 3
};

const loggerSettings = {
  level: 'info',
  levels: logLevels,
  transports: [
    new transports.Console({
      level: 'info',
      silent: process.env.NODE_ENV === 'production',
      format: format.combine(
        colorize(),
        timestamp(),
        consoleLogFormat
      )
    }),
    new transports.File({
      level: 'upload',
      filename: 'logs/index.log',
      format: format.combine(
        timestamp(),
        json()
      )
    })
  ]
};

const logger = createLogger(loggerSettings);

module.exports = {
  logger,
  loggerSettings
};
