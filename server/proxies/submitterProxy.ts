import config from 'config';
import expressWinston from 'express-winston';
import proxy from 'express-http-proxy';
import { format } from 'url';
import { Request, Router, Response, NextFunction } from 'express';
import { logger, loggerSettings } from '../logger';
import { REQUEST_TIMEOUT } from 'http-status-codes';

const defaultErrorMessage = { message: 'Something went wrong.' };
const handledErrorCodes = ['ENOTFOUND', 'ECONNREFUSED'];
const restrictedPaths = [
  '/submissions/extended',
  '/stats',
  '/api/releaser',
  '/api/pmc',
  '/submissions/ftp',
  '/submissions/refresh',
  '/auth/refresh-user',
  '/auth/check-registration'
];

const isMultipartRequest = (req: Request) => {
  const contentTypeHeader = req.headers['content-type'];
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
};

const proxyConfig = (req: Request, pathname: string) => {
  const filesLimit: string = config.get('files');

  return {
    limit: filesLimit,
    memoizeHost: true,
    parseReqBody: !isMultipartRequest(req),
    proxyReqPathResolver: (proxyReq: Request) => {
      return pathname ? `/${pathname}${proxyReq.url}` : req.url;
    },
    proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
      if (err && err.code && handledErrorCodes.includes(err.code)) {
        logger.log({ level: 'error', ...err });

        return res.status(REQUEST_TIMEOUT).send(defaultErrorMessage);
      }

      next(err);
    },
    filter: (req: Request) => {
      return !restrictedPaths.some((restrictedPath) => req.url.includes(restrictedPath));
    }
  };
};

export const submitterProxy = (path: string, router: Router) => {
  const backContextPath: string = config.get('backend.context');
  const backUri: string = config.get('backend.uri');
  const backUriFormatted: string = format(backUri);

  router.use(path, expressWinston.logger(loggerSettings), (req, res, next) =>
    proxy(backUriFormatted, proxyConfig(req, backContextPath))(req, res, next)
  );
};
