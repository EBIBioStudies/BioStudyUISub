'use stricvt';
var express = require('express');
var router = express.Router();


var home = require('./home');
var auth = require('./auth');
var submission = require('./submission');
var files = require('./files');
var config = require('config');
var userdata = require('./userdata');
var biosd=config.get('biostd');
var proxy= require('./proxy');
module.exports = function (app) {
        app.use('/', home);
        app.use('/auth',auth);
        app.use('/data', submission);
        app.use('/files', files);
        app.use('/userdata', userdata);
        app.use('/proxy/api', proxy);

};


