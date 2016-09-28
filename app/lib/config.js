import angular from 'angular';
export default angular.module("BioStudyApp.config", [])
.constant("APP_PROXY_BASE", "/proxy")
.constant("APP_DEBUG_ENABLED", true)
.constant("APP_VERSION", "0.0.4");
