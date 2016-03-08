var path = require('path');


var envHelper={};

envHelper.node_env = process.env.NODE_ENV || 'dev';
envHelper.copyToPath=process.env.BIOSD_DIR || '.build';
envHelper.configDir=path.resolve('public/js/config/');
envHelper.configFile=envHelper.node_env + ".json";

module.exports = envHelper;
