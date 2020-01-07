// Load env vars into process.env
require('dotenv').config();

const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('config');
const express = require('express');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const path = require('path');
const submitterProxy = require('./proxies/submitterProxy');
const { registryProxy, resolverProxy } = require('./proxies/identifiersProxy');
const { loggerSettings } = require('./logger');
const loggerProxy = require('./proxies/loggerProxy');

const { port, hostname, protocol } = config.express;

const app = express();
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

app.use('*/static', express.static(config.assets.path));

// Proxies
submitterProxy(app);
registryProxy(app);
resolverProxy(app);
loggerProxy(app);

// In DEV mode this service only proxies requests to the backend.
// In PROD it serves the Angular static files as well.
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
}

// This has to be after app settings and routes definition.
app.use(expressWinston.errorLogger(loggerSettings));

app.listen(port, hostname, () => {
  console.log(`Proxy and host running on: ${protocol}://${hostname}:${port}`);
});
