const { format, transports } = require('winston');
const { combine, colorize, timestamp, printf, json } = format;

const messageFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const loggerSettings = {
  transports: [
    new transports.Console()
  ],
  format: combine(
    colorize(),
    timestamp(),
    messageFormat
  ),
  msg: "HTTP {{req.method}} {{req.url}}",
  colorize: true,
  expressFormat: false,
  meta: false
};

const errorLoggerSettings = {
  transports: [
    new transports.Console()
  ],
  format: format.combine(
    colorize(),
    json()
  )
};

module.exports = {
  loggerSettings,
  errorLoggerSettings
};
