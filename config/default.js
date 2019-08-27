module.exports = {
  files: {
    limit: '1024mb'
  },
  express: {
    hostname: '0.0.0.0',
    port: '9090',
    protocol: 'http'
  },
  backend: {
    context: 'submission',
    uri: {
      hostname: 'biostudy',
      port: '8585',
      protocol: 'http'
    }
  },
  assets: {
    path: 'public'
  },
  identifiers: {
    registry_uri: {
      pathname: 'restApi',
      hostname: 'registry.api.identifiers.org',
      protocol: 'https'
    },
    resolver_uri: {
      hostname: 'resolver.api.identifiers.org',
      protocol: 'https'
    }
  }
};
