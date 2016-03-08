'use strict';
require('../../../envHelper');
require('../testHelper');

var debug = require('debug')('BioSampleUi');
var app = require('../../../app');


var _expect = require('chai').expect;
var should = require('chai').should();
var request = require('supertest');
var express = require('express');

describe('Test get, create and delete submission', function () {
  var server;
  before(function(done) {
    var port = 1277;
    app.set('port', port);

    server = app.listen(app.get('port'), function() {
      console.log('starting');
      debug('Express server listening on port ' + server.address().port);
      done();
    });

  });

  after(function(done) {
    server.close(done);
  });

  it('should return submissions', function (done) {
    request(server).get('/files/dir').expect(200).end(function(err, res) {
      _expect(err).to.be.null;
      _expect(res.body).to.be.a('object');
      _expect(res.body.status).to.equal('OK');
      _expect(res.body.files).to.be.a('array');
      _expect(res.body.files[0].name).to.equal('User');
      _expect(res.body.files[0].type).to.equal('DIR');
      _expect(res.body.files[0].path).to.equal('/User');
      _expect(res.body.files[0].files).to.be.a('array');
      done();
    });
  });
});