/**
* Created by mdylag on 03/09/2014.
*/

'use strict';
var app = angular.module('BioStudyApp');
var SubmissionModel = require('../../../shared/newmodel/SubmissionModel');
var ModuleHelper = require('./modelHelper');
app.factory('SubmissionModel', function() {
  return SubmissionModel;
});
app.service('ModuleHelper', ModuleHelper);

module.exports=app;
