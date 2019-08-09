#!/bin/bash

set -e
set -v

# Artifact name
artifact=subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# Copy Artifact in home dir
scp -o StrictHostKeyChecking=no $artifact ${VM_USER}@${VM_HOSTNAME}:${VM_HOME_DIR}/node/subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# Execute next stops in home dir
cd ${VM_HOME_DIR}/node

# Extract files
tar xzf subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# Install dependencies
npm install

# Stop current executions
npx forever stopall

# Start fresh execution
npx forever start -l ${VM_HOME_DIR}/node/logs/forever.log --append server/app.js

# Clean up
rm subtool-${CI_ENVIRONMENT_SLUG}.tar.gz
