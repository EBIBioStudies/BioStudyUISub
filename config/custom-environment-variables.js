module.exports = {
  express: {
    context: 'CONTEXT_PATH',
    hostname: 'HOSTNAME',
    port: 'PORT',
    protocol: 'PROTOCOL'
  },
  backend: {
    context: 'BACKEND_PATH_CONTEXT',
    uri: {
      hostname: 'BACKEND_HOST_NAME',
      port: 'BACKEND_PORT',
      protocol: 'BACKEND_PROTOCOL'
    }
  },
};
