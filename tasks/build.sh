#!/bin/bash

set -e
set -v

# Clean build dist folder
rm -rf server/public && mkdir server/public

# Build assets into dist/public folder
npx ng build --outputPath=server/public --deleteOutputPath=true
