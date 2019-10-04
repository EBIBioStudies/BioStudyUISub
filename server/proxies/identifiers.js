const config = require('config');
const expressWinston = require('express-winston');
const request = require('request');
const { format } = require('url');
const { loggerSettings } = require('../logger');

const registryProxy = (app) => {
  const identifiersRegistryUri = format(config.identifiers.registry_uri);

  app.use('/identifiers/registry', expressWinston.logger(loggerSettings), (req, res) => {
    const identifiersUrl = `${identifiersRegistryUri}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};

const resolverProxy = (app) => {
  const resolverRegistryUri = format(config.identifiers.resolver_uri);

  app.use('/identifiers/resolver', expressWinston.logger(loggerSettings), (req, res) => {
    const identifiersUrl = `${resolverRegistryUri}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};

module.exports = {
  registryProxy,
  resolverProxy
};
