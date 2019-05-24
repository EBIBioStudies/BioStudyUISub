#!/bin/bash

set -e
set -v

# Clone Proxy into proxy folder
git clone https://github.com/EBIBioStudies/BioStudySubmProxy.git proxy

# Copy the artifacts generated in build_ui stage
if [ -f subtool.tar.gz ]; then
  tar -xvf subtool.tar.gz -C proxy/WebContent
fi

# Get property values from Environment Variables
bsBackendUrl=${PROXY_BACKEND_URL}
bsBackendUrl_4tests=${PROXY_BACKEND_URL_TESTS}
logLevel=${PROXY_LOG_LEVEL}
httpsFilterDisabled=${PROXY_HTTPS_FILTER_DISABLED}
offlineMode=${PROXY_OFFLINE_MODE}
offlineUserDir=${PROXY_OFFLINE_MODE_DIR}

# Copy properties to gradle.properties
echo -e "
bsBackendUrl=${bsBackendUrl}
bsBackendUrl_4tests=${bsBackendUrl_4tests}
logsDir=\${catalina.base}/logs/ves-hx-74
logLevel=${logLevel}
httpsFilterDisabled=${httpsFilterDisabled}
offlineMode=${offlineMode}
offlineUserDir=${offlineUserDir}
" > proxy/gradle.properties

cd proxy && ./gradlew clean build war -x test
