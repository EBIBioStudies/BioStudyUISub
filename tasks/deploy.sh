#!/bin/bash

set -e
set -v

# Artifact name
artifact=subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# Command to be ran in the VM
# restart_command="cd ${VM_HOME_DIR} && bin/stop && bin/clean_dirs && cp deploy/${WAR_NAME}.war webapps/ && bin/start"

# Copy Artifacts
scp -o StrictHostKeyChecking=no $artifact ${VM_USER}@${VM_HOSTNAME}:${VM_HOME_DIR}/node/subtool-${CI_ENVIRONMENT_SLUG}.tar.gz

# SSH the instance
# ssh -oStrictHostKeyChecking=no -v ${VM_USER}@${VM_HOSTNAME} $restart_command
