'use strict';

var path = require('path');

//set config directory if not set
process.env.NODE_CONFIG_DIR  = process.env.NODE_CONFIG_DIR || path.join(__dirname,'bin','config');
