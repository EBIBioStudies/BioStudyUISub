#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Clean build dist folder
rm -rf dist/public && mkdir dist/public

# Config properties
contextPath=${CONTEXT_PATH};
instanceKey=${INSTANCE_KEY};
appPort=${PORT}
appProxyBase=${APP_PROXY_BASE};
backendHostName=${BACKEND_HOST_NAME}
backendPathContext=${BACKEND_PATH_CONTEXT}
backendPort=${BACKEND_PORT}
ciEnvironment=${CI_ENVIRONMENT_SLUG};

# Update config.json
sed -i 's%"APP_PROXY_BASE":.*%"APP_PROXY_BASE":"'$appProxyBase'",%' src/config.json
sed -i 's%"CONTEXT_PATH":.*%"CONTEXT_PATH":"'$contextPath'",%' src/config.json
# Last line, don't append a comma
sed -i 's%"INSTANCE_KEY".*%"INSTANCE_KEY":"'$instanceKey'"%' src/config.json

# Create .env file
echo "
BACKEND_PATH_CONTEXT=${backendPathContext}
BACKEND_HOST_NAME=${backendHostName}
BACKEND_PORT=${backendPort}
PORT=${appPort}
" > dist/.env
