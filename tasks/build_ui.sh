#!/bin/bash

set -e
set -v

# Config properties
appProxyBase=${APP_PROXY_BASE};
appContext=${APP_CONTEXT};
appInstanceKey=${APP_INSTANCE_KEY};
ciEnvironmentSlug=${CI_ENVIRONMENT_SLUG};
ciEnvironmentName=${CI_ENVIRONMENT_NAME};

# Update config.json
sed -i 's%"APP_PROXY_BASE":.*%"APP_PROXY_BASE":"'$appProxyBase'",%' src/config.json
sed -i 's%"APP_ENV":.*%"APP_ENV":"'$ciEnvironmentName'",%' src/config.json
sed -i 's%"APP_CONTEXT":.*%"APP_CONTEXT":"'$appContext'",%' src/config.json
# Last line, don't append a comma
sed -i 's%"APP_INSTANCE_KEY".*%"APP_INSTANCE_KEY":"'$appInstanceKey'"%' src/config.json

# Build assets into dist/public folder
npx ng build --outputPath=dist --deleteOutputPath=true

# Create artifact
if [ -n "${CI}" ]; then
  # Create artifact
  tar -czf subtool-$ciEnvironmentSlug.tar.gz -C dist .
fi
