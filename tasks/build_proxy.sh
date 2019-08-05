#!/bin/bash

set -e
set -v

# Clone Proxy into proxy folder
git clone -b fix/build https://github.com/EBIBioStudies/BioStudySubmProxy.git proxy

# Get property values from Environment Variables
bsBackendUrl=${PROXY_BACKEND_URL}
bsBackendUrl_4tests=${PROXY_BACKEND_URL_TESTS}
logLevel=${PROXY_LOG_LEVEL}
httpsFilterDisabled=${PROXY_HTTPS_FILTER_DISABLED}
offlineMode=${PROXY_OFFLINE_MODE}
offlineUserDir=${PROXY_OFFLINE_MODE_DIR}
ciEnvironment=$CI_ENVIRONMENT_SLUG;

# Copy the artifacts generated in build_ui stage
if [ -f subtool-$ciEnvironment.tar.gz ]; then
  mkdir proxy/WebContent
  tar -xvf subtool-$ciEnvironment.tar.gz -C proxy/WebContent
fi

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

cd proxy && ./gradlew clean build war -x test -PwarName=proxy-$ciEnvironment.war
