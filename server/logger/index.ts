import { createLogger, format, transports } from 'winston';

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

export const loggerSettings = {
  level: 'info',
  levels: logLevels,
  transports: [
    new transports.Console({
      level: 'warn',
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

export const logger = createLogger(loggerSettings);
