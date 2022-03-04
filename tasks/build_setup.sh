#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Clean build dist folder
rm -rf dist/public && mkdir dist/public

# Install envsubst. This version supports default values for env vars.
curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o envsubst
chmod +x envsubst
mv envsubst /usr/local/bin

cat src/config-ci.json | envsubst > src/config-copy.json
mv src/config-copy.json src/config.json

# Create .env file
echo "
BACKEND_PATH_CONTEXT=${BACKEND_PATH_CONTEXT}
BACKEND_HOST_NAME=${BACKEND_HOST_NAME}
BACKEND_PORT=${BACKEND_PORT}
PORT=${PORT}
CONTEXT_PATH=${CONTEXT_PATH}
RABBITMQ_URI=${RABBITMQ_URI}
RABBITMQ_SUBM_STATUS_QUEUE_NAME=${RABBITMQ_SUBM_STATUS_QUEUE_NAME}
LOGS_ENVIRONMENT=${CI_ENVIRONMENT_NAME}
LOGS_SLACK_WEBHOOK_URL=${LOGS_SLACK_WEBHOOK_URL}
" > dist/.env
