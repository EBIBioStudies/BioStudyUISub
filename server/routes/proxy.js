'use strict';
var _ =           require('underscore'),
  path =      require('path'),
  express = require('express'),
  router = express.Router(),
  config = require('config');
var list = require('../models/submissions.json');
//var biosd=config.get('biostd');
var submission = require('../models/submission.json');

var files=require('../models/files');


router.get('/submission/*',function(req, res) {
  for (var i in list.submissions) {
    //console.log('submission', list.submissions[i], req.params[0]);

    if (list.submissions[i].accno === req.params[0]) {
      submission.accno = list.submissions[i].accno;
      submission.id = list.submissions[i].id;
      console.log('Data submission is equal to', submission);
      res.status(200).json(submission);
      return;
    }
  }
  res.status(200).json({});
});

router.get('/submissions',function(req, res) {
  console.log('submission/list', list);
  res.status(200).json(list);
});

router.post('/save',function(req, res) {

});

router.post('/submission/submit',function(req, res) {
  console.log('create', JSON.stringify(req.body));
  res.status(401).json({mapping:[{assigned: 'T-SUB-1'}]});
});

router.post('/submission/create',function(req, res) {
  console.log('create', JSON.stringify(req.body));
  res.status(200).json({mapping:[{assigned: 'T-SUB-1'}]});
});

router.post('/submission/save',function(req, res) {
  console.log('save create post');
  res.status(200).json({mapping:[{assigned: 'T-SUB-1'}]});
});

router.put('/submission/save/*',function(req, res) {
  console.log('save upodate put');
  res.status(200).json({mapping:[{assigned: 'T-SUB-1'}]});
});


router.put('/submission/update',function(req, res) {
  //var _url = biosd.url + biosd.routes.submission.update.path;
  console.log('Update data', req.body);
  res.status(200).json({});

});

router.delete('/submission/delete/*',function(req, res) {
  console.log('data delete');
    res.status(200).json({});
});

router.delete('/submission/submited/delete/*',function(req, res) {
  console.log('delete submited');
  res.status(200).json({});
});

router.post('/auth/register',function(req, res, next) {
  res.status(200).json({});
});

router.post('/auth/signout',function(req, res, next) {
  console.log('signout');
  res.status(200).json({});
});

router.post('/auth/signup',function(req, res, next) {
  console.log('signout');
  res.status(200).json({});
});

//files/dir
router.get('/files/dir',function(req, res) {
  res.json(files.getTree());
});

router.delete('/files/delete',function(req, res) {
  res.json({});
});



module.exports = router;
