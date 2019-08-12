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
const { limit } = config.files;

const app = express();
app.use(helmet());
app.use(compression());

const backendUri = format(config.backend.uri);
const proxyConfig = {
  limit,
  memoizeHost: true,
  proxyReqPathResolver: (req) => `/${context}${req.url}`
};

app.use('/static', express.static(config.assets.path));
app.use(
  ['*/raw', '*/api'],
  expressWinston.logger(loggerSettings),
  proxy(backendUri, proxyConfig)
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
