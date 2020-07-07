import config from 'config';
import { format } from 'url';
import { Router } from 'express';
import { logger } from '../logger';

export const loggerProxy = (path: string, router: Router) => {
  const expressConfig: ExpressUri = config.get('express');
  const hostUri = format(expressConfig);
  const isDevelopment = process.env.NODE_ENV === 'development';

  router.use(path, (req, res) => {
    const { origin } = req.headers;

    if (origin === hostUri || isDevelopment) {
      logger.log(req.body);
    }

    res.send();
  });
};
