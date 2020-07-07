// Load env vars into process.env
require('dotenv').config();

import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import express from 'express';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import path from 'path';
import { submitterProxy } from './proxies/submitterProxy';
import { registryProxy, resolverProxy } from './proxies/identifiersProxy';
import { loggerSettings } from './logger';
import { loggerProxy } from './proxies/loggerProxy';

const expressConfig: ExpressUri = config.get('express');
const { context, port, hostname, protocol } = expressConfig;
const staticPath: string = config.get('assets.path');

const app = express();
const router = express.Router();
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '20GB' }));

// Proxies
submitterProxy('*/api', router);
registryProxy('/identifiers/registry', router);
resolverProxy('/identifiers/resolver', router);
loggerProxy('/log', router);

router.use(express.static(staticPath));

// In DEV mode this service only proxies requests to the backend.
// In PROD it serves the Angular static files as well.
if (process.env.NODE_ENV === 'production') {
  router.get('/thor-integration', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'thor-integration.html'));
  });

  router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
}

app.use(context, router);

// This has to be after app settings and routes definition.
app.use(expressWinston.errorLogger(loggerSettings));

app.listen(port, hostname, () => {
  // tslint:disable-next-line: no-console
  console.log(`Proxy and host running on: ${protocol}://${hostname}:${port}${context}`);
});