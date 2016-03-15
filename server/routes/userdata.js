'use strict';

var express = require('express'),
    router = express.Router(),
    config = require('config');

//var biosd=config.get('biostd');
//var serverType = config.get('server');
var list = require('../models/tempsubmissions.json');

router.get('/list',function(req, res, next) {
    console.log('userdata');
    res.status(200).json(list);
});

router.get('/register',function(req, res, next) {
    res.status(200).json({});
});

router.post('/set',function(req, res, next) {
    console.log(req.body);
    res.status(200).json({});
});

router.post('/register',function(req, res, next) {
    res.status(200).json({});
});



module.exports = router;
