#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Config properties
appProxyBase=$APP_PROXY_BASE;
appContext=$APP_CONTEXT;
appDebugEnabled=$APP_DEBUG_ENABLED;
appInstanceKey=$APP_INSTANCE_KEY;

# Update config
sed -i 's/"APP_PROXY_BASE":(.*)/"'$appProxyBase'",' config.json
# sed -i 's/\(.*"APP_CONTEXT":\)\(.*\)/\1"'$appContext'",/' config.json
# sed -i 's/\(.*"APP_DEBUG_ENABLED":\)\(.*\)/\1'$appDebugEnabled',/' config.json
# Last line, don't append a comma
# sed -i 's/\(.*"APP_INSTANCE_KEY":\)\(.*\)/\1"'$appInstanceKey'"/' config.json

# Build assets into dist/public folder
npx ng build --outputPath=dist --deleteOutputPath=true

# Create artifact
if [ -n "${CI}" ]; then
  # Create artifact
  tar -czf subtool.tar.gz -C dist .
fi
