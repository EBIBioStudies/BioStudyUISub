'use strict';

var express = require('express'),
  router = express.Router(),
  config = require('config');

//var biosd=config.get('biostd');
//var serverType = config.get('server');
console.log("node dev");

function signup(req, res) {
  var data=req.body;
  console.log('Data',data);
  res.status(body.status).json(body.dataJson);
}

router.post('/signup',signup);
console.log('signin');

router.post('/signin',function(req, res, next) {
  console.log('signin');
  res.status(200).json({
    "status": "OK",
        "sessid": "Kbec9358596a94ba3cf35930a56216b26542f764f", "username": "demo"
  });

});

router.post('/signout',function(req, res) {
  res.status(200).json({});
});

module.exports = router;
