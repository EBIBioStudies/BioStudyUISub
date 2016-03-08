'use strict';

var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var Busboy = require('busboy');

var files=require('../models/files');


router.get('/fileUpload', function (req, res) {
    res.status(200).json({});
});

router.post('/fileUpload', function (req, res) {
  // request.files will contain the uploaded file(s),
  // keyed by the input name (in this case, "file")
  // show the uploaded file name
    console.log('Data');
  var busboy = new Busboy({ headers: req.headers });
  console.log('Req', req.headers);
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        //start saving the data
        file.on('data', function(data) {
            //write data
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
            //close file
            console.log('File [' + fieldname + '] Finished');
            files.addFile(filename);
        });
    });
    busboy.on('finish', function() {
        res.end('upload complete');
    });
    req.pipe(busboy);
});

//files/dir
router.get('/dir',function(req, res) {
    res.json(tree);
});

module.exports = router;
