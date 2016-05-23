'use strict';
require('../../../envHelper');
require('../testHelper');

var debug = require('debug')('BioSampleUi');
var app = require('../../../app');


var _expect = require('chai').expect;
var should = require('chai').should();
var request = require('supertest');
var express = require('express');

describe('Test signin, signup and signout submission', function () {
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

  it('should try signup with existing user ', function (done) {
    var jsonUserExists={  'login': 'demo',
      'password': 'demo',
      'username': 'demo',
      'email': 'demo' ,
      'recaptcha_challenge': 'ch',
      'recaptcha_response': 'ch'};
    request(server).post('/auth/signup')
      .send(jsonUserExists)
      .expect(403).end(function(err, res) {
        console.log(res.body);
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('FAIL');
        _expect(res.body.message).to.be.equal('User exists');

      done(err);
    });
  });

  it('should try signup with empty login ', function (done) {
    var json={
      'password': 'demo',
      'username': 'demo',
      'email': 'demo' ,
      'recaptcha_challenge': 'ch',
      'recaptcha_response': 'ch'};
    request(server).post('/auth/signup')
      .send(json)
      .expect(400).end(function(err, res) {
        console.log(res.body);
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('FAIL');
        _expect(res.body.message).to.be.equal('\'Login\' parameter is not defined');

        done(err);
      });
  });

  it('should signup with success ', function (done) {
    var json={
      'login': 'demos',
      'password': 'demo',
      'username': 'demos',
      'email': 'demo' ,
      'recaptcha_challenge': 'ch',
      'recaptcha_response': 'ch'};
    request(server).post('/auth/signup')
      .send(json)
      .expect(200).end(function(err, res) {
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('OK');
        //_expect(res.body.message).to.be.equal('\'Login\' parameter is not defined');

        done(err);
      });
  });

  it('should signin with success ', function (done) {
    var json={
      'login': 'demo',
      'password': 'demo'};

    request(server).post('/auth/signin')
      .send(json)
      .expect(200).end(function(err, res) {
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('OK');
        done(err);
      });

  });

  it('should not signin with success ', function (done) {
    var json={
      'login': 'demo1',
      'password': 'demo'};

    request(server).post('/auth/signin')
      .send(json)
      .expect(403).end(function(err, res) {
        _expect(err).to.be.null;
        _expect(res.body.status).to.be.equal('FAIL');
        done(err);
      });

  });


});