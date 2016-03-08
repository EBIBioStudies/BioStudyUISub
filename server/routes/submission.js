'use strict';
var _ =           require('underscore'),
  path =      require('path'),
  express = require('express'),
  router = express.Router(),
  config = require('config');
var list = require('../models/submissions.json');
var biosd=config.get('biostd');
var submission = require('../models/submission.json');

router.get('/submission/*',function(req, res) {

  for (var i in list.submissions) {
    //console.log('submission', list.submissions[i], req.params[0]);

    if (list.submissions[i].accno === req.params[0]) {
      submission.accno = list.submissions[i].accno;
      submission.id = list.submissions[i].id;
      console.log('Data submission is equal to', submission);
      res.status(200).json(submission);
    }
  }
  res.status(403).json({});
});

router.get('/sbmlist',function(req, res) {
  console.log('submission/list', list);
  res.status(500).json(list);
});

router.post('/save',function(req, res) {

});


router.post('/create',function(req, res) {
  console.log('create', JSON.stringify(req.body));
  res.status(200).json({mapping:[{assigned: 'T-SUB-1'}]});
});

router.post('/update',function(req, res) {
  var _url = biosd.url + biosd.routes.submission.update.path;
  console.log('Update data', req.body);
  res.status(200).json({});

});

router.post('/delete',function(req, res) {
  console.log('data', req.query.id);
  var _url = biosd.url + biosd.routes.submission.delete.path + '?id=' + req.query.id;
  utils.requestQ({method: 'GET',url: _url}).then(function(response) {
    res.status(response.statusCode).json(response.body);
    console.log('delete', response.body, response.statusCode);
  }).catch(function(err, response) {
    console.log('error 2', err);
    res.status(403).json({staus:'ERROR',message:'Connection error to BIOSD server'});
  });

});

module.exports = router;
