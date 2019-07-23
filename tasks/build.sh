#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Clean build dist folder
rm -rf dist/public && mkdir dist/public

# Build assets into dist/public folder
npx ng build --outputPath=dist/public --deleteOutputPath=true

# Copy package.json to server
cp package.json dist/

# Install dependencies
npm install --production --prefix dist

# Copy server files
cp -r server/ dist/

# Copy config files
cp -r config dist/
