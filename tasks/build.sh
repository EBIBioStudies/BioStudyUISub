#!/bin/bash

set -e
set -v

# Variables
ciEnvironment=${CI_ENVIRONMENT_NAME}
ciEnvironmentSlug=${CI_ENVIRONMENT_SLUG}

if [ -n "${CONTEXT_PATH}" ]; then
  baseHref="${CONTEXT_PATH}/"
else
  baseHref="/"
fi

# Build assets into dist/public folder
# Add --prod if ENVIRONMENT is different to DEV
if [ -z "$ciEnvironment" ] || [ "$ciEnvironment" = "DEV" ]; then
  npx ng build --outputPath=dist/public --deleteOutputPath=true --baseHref=${baseHref}
else
  npx ng build --prod --outputPath=dist/public --deleteOutputPath=true --baseHref=${baseHref}
fi

# Copy package.json to server
cp package.json dist/

# Install dependencies only locally
if [ -z "${CI}" ]; then
  npm install --prefix dist
fi

# Copy server files
cp -r server/ dist/server

# Copy config files
cp -r config dist/

# Create log files
mkdir -p dist/logs
touch dist/logs/forever.log

# Create artifact if the script is ran in a CI environment
if [ -n "${CI}" ]; then
  # Create artifact
  tar -czf subtool-$ciEnvironmentSlug.tar.gz -C dist .
fi
