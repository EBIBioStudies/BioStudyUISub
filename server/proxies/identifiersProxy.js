const config = require('config');
const request = require('request');
const { format } = require('url');

const registryProxy = (path, router) => {
  const identifiersRegistryUri = format(config.identifiers.registry_uri);

  router.use(path, (req, res) => {
    const identifiersUrl = `${identifiersRegistryUri}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};

const resolverProxy = (path, router) => {
  const resolverRegistryUri = format(config.identifiers.resolver_uri);

  router.use(path, (req, res) => {
    const identifiersUrl = `${resolverRegistryUri}${req.url}`;

    req.pipe(request(identifiersUrl)).pipe(res);
  });
};

module.exports = {
  registryProxy,
  resolverProxy
};
