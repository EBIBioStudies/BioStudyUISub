import config from 'config';
import request from 'request';
import url from 'url';
import { Router } from 'express';
import { format } from 'url';

export interface RORUri {
  hostname: string;
  protocol: string;
}

export const organizationProxy = (path: string, router: Router) => {
  const rorUri: RORUri = config.get('ror');

  router.use(path, (req, res) => {
    const sourceUrl = url.parse(req.url, true);
    const rorUrl = format({ ...rorUri, query: sourceUrl.query });

    req.pipe(request(rorUrl)).pipe(res);
  });
};
