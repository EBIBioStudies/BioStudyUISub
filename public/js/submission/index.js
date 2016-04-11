'use strict';

var app = angular.module('BioStudyApp');

app.factory('SubmissionService', require('./submission.service'));
app.factory('FileService', require('./file.service'));
app.controller('SubmissionListCtrl', require('./views/submissionList.ctrl'));
app.controller('EditSubmissionCtrl', require('./views/editSubmission.ctrl'));
app.controller('AddSubmissionCtrl', require('./views/addSubmission.ctrl'));

