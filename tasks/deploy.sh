#!/bin/bash

set -e
set -v

# Artifact name
artifact=proxy/build/libs/proxy-${CI_ENVIRONMENT_SLUG}.war

# Command to be ran in the VM
restart_command="cd ${VM_HOME_DIR} && bin/stop && bin/clean_dirs && cp deploy/submissions.war webapps/ && bin/start"

echo ${VM_USER}@${VM_HOSTNAME}

# Copy Artifacts
scp -o StrictHostKeyChecking=no $artifact ${VM_USER}@${VM_HOSTNAME}:${VM_HOME_DIR}/deploy/submissions.war


# SSH the instance
ssh -oStrictHostKeyChecking=no ${VM_USER}@${VM_HOSTNAME} $restart_command
