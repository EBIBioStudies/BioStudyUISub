#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print shell input lines as they are read
set -v

# Clean build dist folder
rm -rf dist && mkdir dist

# Build assets into dist/public folder
npx ng build --outputPath=dist --deleteOutputPath=true

# Create artifact
if [ -n "${CI}" ]; then
  # Create artifacts folder
  mkdir -p artifacts

  # Create artifact
  tar -czf subtool.tar.gz -C dist .

  # Copy artifact into "artifacts" folder
  cp locations.tar.gz artifacts/
fi
