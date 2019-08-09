// Load env vars into process.env
require('dotenv').config();

const compression = require('compression');
const config = require('config');
const express = require('express');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
const { format } = require('url');
const { loggerSettings, errorLoggerSettings } = require('./logger');

const { port, hostname, protocol } = config.express;
const { context } = config.backend;
const { limit } = config.files;

const app = express();
app.use(helmet());
app.use(compression());

const router = express.Router();
const backendUri = format(config.backend.uri);
const proxyConfig = {
  limit,
  memoizeHost: true,
  proxyReqPathResolver: (req) => `/${context}${req.url}`
};

app.use('/', router);
router.use('/', express.static(config.assets.path));
router.use(
  ['*/raw', '*/api'],
  expressWinston.logger(loggerSettings),
  proxy(backendUri, proxyConfig)
);

// This has to be after app settings and routes definition.
app.use(expressWinston.errorLogger(errorLoggerSettings));

app.listen(port, hostname, () => {
  console.log(`Server running on: ${protocol}://${hostname}:${port}`);
});
