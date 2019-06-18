#!/bin/bash

set -e
set -v

# Artifact name
artifact=proxy-${CI_ENVIRONMENT_SLUG}.war

# Command to be ran in the VM
restart_command="cd ${VM_HOME_DIR} && bin/stop && bin/clean_dirs && cp deploy/$artifact webapps/ && bin/start"

# Copy Artifacts
# scp $artifact ${VM_USER}@${VM_HOSTNAME}:${VM_HOME_DIR}/deploy/$artifact

echo $VM_USER@$VM_HOSTNAME
echo ${VM_USER}@${VM_HOSTNAME}

# SSH the instance
# ssh -oStrictHostKeyChecking=no ${VM_USER}@${VM_HOSTNAME}
