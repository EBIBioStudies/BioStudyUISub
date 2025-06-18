#!/bin/bash

set -e
set -v

# This script should only be executed in the VM.

# Arguments
homeDir=$1
artifact=$2

# Execute steps in home dir
cd $homeDir/node

# Extract files
tar xzf $artifact

# Install dependencies
npm install

# Stop current executions
pkill -f node || true

# Start fresh execution
NODE_ENV=production npx forever start -l $homeDir/node/logs/forever.log --append server/app.js

# Clean up
rm $artifact
