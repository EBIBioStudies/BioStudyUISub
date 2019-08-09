#!/bin/bash

set -e
set -v

# Variables
artifact=subtool-${CI_ENVIRONMENT_SLUG}.tar.gz
homeDir=${VM_HOME_DIR}

# Copy Artifact in home dir
scp -o StrictHostKeyChecking=no $artifact ${VM_USER}@${VM_HOSTNAME}:$homeDir/node/$artifact

# Execute deplo_steps.sh file via SSH
ssh -oStrictHostKeyChecking=no -v ${VM_USER}@${VM_HOSTNAME} 'bash -s' < ./tasks/deploy_steps.sh $homeDir $artifact
