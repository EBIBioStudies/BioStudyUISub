module.exports = {
  files: {
    limit: '200mb'
  },
  express: {
    hostname: '0.0.0.0',
    port: '8080',
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
    path: 'server/public'
  }
};
