'use stricvt';
var express = require('express');
var router = express.Router();
var proxy= require('./proxy');
module.exports = function (app) {
        app.use('/proxy/api', proxy);

};


