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
  rabbitmq: {
    uri: 'RABBITMQ_URI',
    submStatusQueueName: 'RABBITMQ_SUBM_STATUS_QUEUE_NAME'
  },
  logs: {
    environment: 'LOGS_ENVIRONMENT',
    slack_webhook_url: 'LOGS_SLACK_WEBHOOK_URL'
  }
};
