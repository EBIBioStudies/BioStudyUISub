#!/bin/bash

set -e
set -v

# Execute deplo_steps.sh file via SSH
ssh -oStrictHostKeyChecking=no -v ${VM_USER}@${VM_HOSTNAME} 'bash -s' < ./tasks/deploy_steps.sh
