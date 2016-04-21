/**
* Created by mdylag on 03/09/2014.
*/

'use strict';
var app = angular.module('BioStudyApp');
var SubmissionModel = require('../../../shared/model/SubmissionModel');
var ModuleHelper = require('./moduleHelper2');
app.factory('SubmissionModel', function() {
  return SubmissionModel;
});
app.service('ModuleHelper', ModuleHelper);

module.exports=app;
