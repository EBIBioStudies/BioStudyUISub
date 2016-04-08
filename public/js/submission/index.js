'use strict';

var app = angular.module('BioStudyApp');

app.factory('SubmissionService', require('./submission.service'));
app.controller('SubmissionListCtrl', require('./views/submissionList.ctrl'));