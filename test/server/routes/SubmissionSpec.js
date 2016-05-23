'use strict';
require('../../../envHelper');
require('../testHelper');

var debug = require('debug')('BioSampleUi');
var app = require('../../../app');


var _expect = require('chai').expect;
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
    request(server).get('/submit/list')
      .expect(200)
      .end(function(err, res) {
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('OK');

        var data = res.body.submissions;
        _expect(data).to.be.a('array');
        _expect(data.length).to.be.equal(2);

        for (var i in data) {
          _expect(data[i].id).to.be.within(1,2);
          _expect(data[i].accno).to.be.equal('BS-' + data[i].id);

        }
        done();
      });
  });
});