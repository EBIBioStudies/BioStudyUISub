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
frontendURL=${FRONTEND_URL}
backendHostName=${BACKEND_HOST_NAME}
backendPathContext=${BACKEND_PATH_CONTEXT}
backendPort=${BACKEND_PORT}
ciEnvironment=${CI_ENVIRONMENT_SLUG};
ciEnvironmentName=${CI_ENVIRONMENT_NAME};
mainSuperUserUsername=${APP_SUPER_USER_USERNAME}
announcementHeadline=${APP_ANNOUNCEMENT_HEADLINE}
announcementContent=${APP_ANNOUNCEMENT_CONTENT}
announcementPriority=${APP_ANNOUNCEMENT_PRIORITY}

# Update config.json
sed -i 's%"APP_PROXY_BASE":.*%"APP_PROXY_BASE":"'$appProxyBase'",%' src/config.json
sed -i 's%"APP_ENV":.*%"APP_ENV":"'$ciEnvironmentName'",%' src/config.json
sed -i 's%"APP_CONTEXT":.*%"APP_CONTEXT":"'$contextPath'",%' src/config.json
sed -i 's%"FRONTEND_URL":.*%"FRONTEND_URL":"'$frontendURL'",%' src/config.json
sed -i 's%"APP_SUPER_USER_USERNAME".*%"APP_SUPER_USER_USERNAME":"'$mainSuperUserUsername'",%' src/config.json
sed -i 's%"APP_ANNOUNCEMENT_HEADLINE".*%"APP_ANNOUNCEMENT_HEADLINE":"'$announcementHeadline'",%' src/config.json
sed -i 's%"APP_ANNOUNCEMENT_CONTENT".*%"APP_ANNOUNCEMENT_CONTENT":"'$announcementContent'",%' src/config.json
sed -i 's%"APP_ANNOUNCEMENT_PRIORITY".*%"APP_ANNOUNCEMENT_PRIORITY":"'$announcementPriority'",%' src/config.json
# Last line, don't append a comma
sed -i 's%"APP_INSTANCE_KEY".*%"APP_INSTANCE_KEY":"'$instanceKey'"%' src/config.json

# Create .env file
echo "
BACKEND_PATH_CONTEXT=${backendPathContext}
BACKEND_HOST_NAME=${backendHostName}
BACKEND_PORT=${backendPort}
PORT=${appPort}
CONTEXT_PATH=${contextPath}
RABBITMQ_URI=${RABBITMQ_URI}
RABBITMQ_SUBM_STATUS_QUEUE_NAME=${RABBITMQ_SUBM_STATUS_QUEUE_NAME}
LOGS_ENVIRONMENT=${ciEnvironmentName}
LOGS_SLACK_WEBHOOK_URL=${LOGS_SLACK_WEBHOOK_URL}
" > dist/.env
