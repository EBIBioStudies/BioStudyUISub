#!/bin/bash

set -e
set -v

# Variables
ciEnvironment=${CI_ENVIRONMENT_SLUG};

# Build assets into dist/public folder
npx ng build --outputPath=dist/public --deleteOutputPath=true

# Copy package.json to server
cp package.json dist/

# Copy server files
cp -r server/ dist/server

# Copy config files
cp -r config dist/

# Create log files
mkdir dist/logs
touch dist/logs/forever.log

# Create artifact if the script is ran in a CI environment
if [ -n "${CI}" ]; then
  # Create artifact
  tar -czf subtool-$ciEnvironment.tar.gz -C dist .
fi
