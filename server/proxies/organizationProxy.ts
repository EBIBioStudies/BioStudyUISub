import config from 'config';
import request from 'request';
import { Router } from 'express';
import { format } from 'url';

export interface RORUri {
  hostname: string;
  protocol: string;
}

export const organizationProxy = (path: string, router: Router) => {
  const rorUri: RORUri = config.get('ror');
  const rorUriFormatted = format(rorUri);

  router.use(path, (req, res) => {
    const rorUrl = `${rorUriFormatted}${req.originalUrl}`;

    console.log(rorUrl);

    req.pipe(request(rorUrl)).pipe(res);
  });
};
