#!/bin/bash
# Creates the Docker image for this project and pushes it to GitLab registry.

set -e
set -v

# Variables
artifact=subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# Create a folder to uncompressed the artifacts
mkdir dist

# Copy the artifact generated in the build stage
if [ -f $artifact ]; then
  tar -xvf $artifact -C ./dist;
fi

# Remove configuration
rm ./dist/.env
rm ./dist/public/config.json

# Login to the GitLab Docker registry
docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

# Build Docker image
docker build -t $CI_REGISTRY/ndiaz/biostudyuisub:latest .

# Push image to docker registry
docker push $CI_REGISTRY/ndiaz/biostudyuisub:latest

# Logout from the registry
docker logout $CI_REGISTRY
