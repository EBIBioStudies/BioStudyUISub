const config = require('config');
const expressWinston = require('express-winston');
const proxy = require('express-http-proxy');
const { format } = require('url');
const { logger, loggerSettings } = require('../logger');
const { REQUEST_TIMEOUT } = require('http-status-codes');

const defaultErrorMessage = { message: 'Something went wrong.' };
const handledErrorCodes = ['ENOTFOUND', 'ECONNREFUSED'];

const proxyConfig = (pathname) => {
  const { limit } = config.files;

  return ({
    limit,
    memoizeHost: true,
    proxyReqPathResolver: (req) => {
      return pathname ? `/${pathname}${req.url}` : req.url;
    },
    proxyErrorHandler: (err, res, next) => {
      if (err && err.code && handledErrorCodes.includes(err.code)) {
        logger.log({ level: 'error', ...err });

        return res.status(REQUEST_TIMEOUT).send(defaultErrorMessage);
      }

      next(err);
    }
  });
};

const submitterProxy = (path, router) => {
  const { context } = config.backend;
  const backendUri = format(config.backend.uri);

  router.use(path, expressWinston.logger(loggerSettings), proxy(backendUri, proxyConfig(context)));
};

module.exports = submitterProxy;
