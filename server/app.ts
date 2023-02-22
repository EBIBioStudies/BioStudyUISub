// Load env vars into process.env
require('dotenv').config();

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
import { organizationProxy } from './proxies/organizationProxy';
import { submStatusController } from './submission-status/submission-status-controller';
import { processSubmStatus } from './submission-status/submission-status-processor';
import { logger } from './logger';

export interface ExpressUri {
  context: string;
  hostname: string;
  port: number;
  protocol: string;
}

const expressConfig: ExpressUri = config.get('express');
const { context, port, hostname, protocol } = expressConfig;
const staticPath: string = config.get('assets.path');

const app = express();
const router = express.Router();
app.use(helmet());
app.use(compression());

router.use(express.static(staticPath));

// Controllers
submStatusController('/subm-status', router);

// Proxies
submitterProxy('*/api', router);
registryProxy('/identifiers/registry', router);
resolverProxy('/identifiers/resolver', router);
organizationProxy('/organizations', router);
loggerProxy('/log', router);

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

app.use(express.json({ limit: '20GB' }));

app.listen(port, hostname, () => {
  logger.info(`Proxy running on: ${protocol}://${hostname}:${port}${context}`);

  processSubmStatus();
});
