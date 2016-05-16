'use strict';
require('./testHelper');
var config=require('config');

var assert = require('assert');


describe('Test Database', function() {
  var submissions;
  describe('Should read configuration', function(){
    it('should return the db object', function(){


      var biostd=config.get('biostd');
      console.log(biostd.url);
    });

  });
});