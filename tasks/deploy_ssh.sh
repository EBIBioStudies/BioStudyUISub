#!/bin/bash

set -e
set -v

# Install ssh-agent if not already installed, it is required by Docker.
which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )

# Run ssh-agent (inside the build environment)
eval $(ssh-agent -s)

# Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
echo "$SSH_KEY" | tr -d '\r' | ssh-add - > /dev/null

# Create the SSH directory and give it the right permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh
