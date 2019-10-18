const config = require('config');
const expressWinston = require('express-winston');
const proxy = require('express-http-proxy');
const { format } = require('url');
const { loggerSettings } = require('../logger');

const proxyConfig = (pathname) => {
  const { limit } = config.files;

  return ({
    limit,
    memoizeHost: true,
    proxyReqPathResolver: (req) => {
      return pathname ? `/${pathname}${req.url}` : req.url;
    }
  });
};

const submitterProxy = (app) => {
  const { context } = config.backend;
  const backendUri = format(config.backend.uri);

  app.use('*/api', expressWinston.logger(loggerSettings), proxy(backendUri, proxyConfig(context)));
};

module.exports = submitterProxy;
