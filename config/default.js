module.exports = {
  files: {
    limit: '10gb'
  },
  express: {
    context: '',
    hostname: 'localhost',
    port: 8080,
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
  },
  ror: {
    pathname: 'organizations',
    hostname: 'api.ror.org',
    protocol: 'https'
  },
  rabbitmq: {
    uri: 'amqp://',
    submStatusQueueName: ''
  },
  logs: {
    environment: 'dev',
    slack_webhook_url: ''
  }
};
