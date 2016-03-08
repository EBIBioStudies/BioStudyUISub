/**
* Created by mdylag on 03/09/2014.
*/

'use strict';
var app = angular.module('BioStudyApp');
var Author= require('../../../shared/model/Author');
var File= require('../../../shared/model/File');
var Publication = require('../../../shared/model/Publication');
var Link= require('../../../shared/model/Link');
var Section= require('../../../shared/model/Section');
var Submission= require('../../../shared/model/Submission');
var User= require('../../../shared/model/User');
var Attribute = require('../../../shared/model/Attribute');

app.factory('Attribute', function() {
  return Attribute;
});
app.factory('Author', function() {
  return Author;
});
app.factory('Publication', function() {
  return Author;
});
app.factory('File', function() {
  return File;
});
app.factory('Link', function() {
  return Link;
});
app.factory('Section', function() {
  return Section;
});
app.factory('Submission', function() {
  return Submission;
});
app.factory('User', function() {
  return User;
});

module.exports=app;
