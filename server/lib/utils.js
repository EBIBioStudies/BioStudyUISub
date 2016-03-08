'use strict';

var request = require('request'),
    q = require('q');

request = request.defaults({jar: true, json: true, method: 'POST'});

module.exports.request = request;

function requestQ(options) {
  var deffer = q.defer();
  request(options,
    function(error, response) {
      if (error) {
        deffer.reject(error, response);
      } else {
        deffer.resolve(response);
      }

    });
  return deffer.promise;
}

module.exports.requestQ = requestQ;