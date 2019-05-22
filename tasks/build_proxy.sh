#!/bin/bash

# Clone Proxy into proxy folder
git clone https://github.com/EBIBioStudies/BioStudySubmProxy.git proxy

# Go to proxy folder
cd proxy

# Get values for properties from Environment Variables
bsBackendUrl=${PROXY_BACKEND_URL}
bsBackendUrl_4tests=${PROXY_BACKEND_URL_TESTS}
logsDir=${CATALINA_BASE}/logs/ves-hx-74
logLevel=${PROXY_LOG_LEVEL}
httpsFilterDisabled=${PROXY_HTTPS_FILTER_DISABLED}
offlineMode=${PROXY_OFFLINE_MODE}
offlineUserDir=${PROXY_OFFLINE_MODE_DIR}

# Copy properties to gradle.properties
echo -e "
bsBackendUrl=${bsBackendUrl}
bsBackendUrl_4tests=${bsBackendUrl_4tests}
logsDir=${logsDir}
logLevel=${logLevel}
httpsFilterDisabled=${httpsFilterDisabled}
offlineMode=${offlineMode}
offlineUserDir=${offlineUserDir}
" > gradle.properties

./gradlew clean build war -x test
