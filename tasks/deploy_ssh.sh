#!/bin/bash

set -e
set -v

# Create the SSH directory and give it the right permissions
mkdir -p ~/.ssh

# Copy the SSH key stored in SSH_KEY env var into id_rsa
echo "$SSH_KEY" | tr -d '\r' > ~/.ssh/id_rsa

echo $SSH_KEY

# Give the right permissions
# chmod 700 ~/.ssh/id_rsa

# Run ssh-agent (inside the build environment)
# eval $(ssh-agent -s)

# Add the SSH key stored in SSH_KEY variable to the agent store
# ssh-add ~/.ssh/id_rsa
