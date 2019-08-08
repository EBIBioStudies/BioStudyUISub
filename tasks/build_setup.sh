#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Clean build dist folder
rm -rf dist/public && mkdir dist/public

# Config properties
appContext=${APP_CONTEXT};
appDebugEnabled=${APP_DEBUG_ENABLED};
appInstanceKey=${APP_INSTANCE_KEY};
appPort=${PORT}
appProxyBase=${APP_PROXY_BASE};
backendHostName=${BACKEND_HOST_NAME}
backendPathContext=${BACKEND_PATH_CONTEXT}
backendPort=${BACKEND_PORT}
ciEnvironment=${CI_ENVIRONMENT_SLUG};

# Update config.json
sed -i 's%"APP_PROXY_BASE":.*%"APP_PROXY_BASE":"'$appProxyBase'",%' src/config.json
sed -i 's%"APP_CONTEXT":.*%"APP_CONTEXT":"'$appContext'",%' src/config.json
sed -i 's%"APP_DEBUG_ENABLED":.*%"APP_DEBUG_ENABLED":'$appDebugEnabled',%' src/config.json
# Last line, don't append a comma
sed -i 's%"APP_INSTANCE_KEY".*%"APP_INSTANCE_KEY":"'$appInstanceKey'"%' src/config.json

# Create .env file
echo -e "
BACKEND_PATH_CONTEXT=${backendPathContext}
BACKEND_HOST_NAME=${backendHostName}
BACKEND_PORT=${backendPort}
PORT=${appPort}
" > dist/.env
