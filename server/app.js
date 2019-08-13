// Load env vars into process.env
require('dotenv').config();

const compression = require('compression');
const config = require('config');
const express = require('express');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
const { format } = require('url');
const path = require('path');
const { loggerSettings, errorLoggerSettings } = require('./logger');

const { port, hostname, protocol } = config.express;
const { context } = config.backend;
const { contextPath: identifiersRegistryContextPath } = config.identifiers.registry_uri;
const { limit } = config.files;

const app = express();
app.use(helmet());
app.use(compression());

const backendUri = format(config.backend.uri);
const identifiersRegistryUri = format(config.identifiers.registry_uri);
const resolverRegistryUri = format(config.identifiers.resolver_uri);
const proxyConfig = (pathname) => ({
  limit,
  memoizeHost: true,
  proxyReqPathResolver: (req) => {
    return pathname ? `/${pathname}${req.url}` : req.url;
  }
});

app.use('/static', express.static(config.assets.path));

// Backend proxy
app.use(
  ['*/raw', '*/api'],
  expressWinston.logger(loggerSettings),
  proxy(backendUri, proxyConfig(context))
);

// Identifiers registry proxy
app.use(
  '/identifiers/registry',
  expressWinston.logger(loggerSettings),
  proxy(identifiersRegistryUri, proxyConfig(identifiersRegistryContextPath))
);

// Identifiers resolver proxy
app.use(
  '/identifiers/resolver',
  expressWinston.logger(loggerSettings),
  proxy(resolverRegistryUri, proxyConfig())
);

// In DEV mode this service only proxies requests to the backend.
// In PROD it serves the Angular static files as well.
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
}

// This has to be after app settings and routes definition.
app.use(expressWinston.errorLogger(errorLoggerSettings));

app.listen(port, hostname, () => {
  console.log(`Proxy and host running on: ${protocol}://${hostname}:${port}`);
});
