#!/bin/bash

set -e
set -v

# This script should only be executed in the VM.

# Execute steps in home dir
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
