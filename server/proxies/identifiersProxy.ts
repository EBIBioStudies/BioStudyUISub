import config from 'config';
import request from 'request';
import { format } from 'url';
import { Router } from 'express';

export interface IdentifiersUri {
  hostname: string;
  pathname: string;
  protocol: string;
}

export const registryProxy = (path: string, router: Router) => {
  const registryUri: IdentifiersUri = config.get('identifiers.registry_uri');
  const registryUriFormatted = format(registryUri);

  router.use(path, (req, res) => {
    const identifiersUrl = `${registryUriFormatted}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};

export const resolverProxy = (path: string, router: Router) => {
  const resolverUri: IdentifiersUri = config.get('identifiers.resolver_uri');
  const resolverUriFormatted = format(resolverUri);

  router.use(path, (req, res) => {
    const identifiersUrl = `${resolverUriFormatted}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};
