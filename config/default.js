module.exports = {
  files: {
    limit: '10gb'
  },
  express: {
    hostname: '0.0.0.0',
    port: '8080',
    protocol: 'http'
  },
  backend: {
    context: '',
    uri: {
      hostname: 'biostudy',
      port: '8585',
      protocol: 'http'
    }
  },
  assets: {
    path: 'public'
  },
  log_stash_uri: {
    hostname: 'ves-ebi-6d',
    port: '3515',
    protocol: 'http'
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
