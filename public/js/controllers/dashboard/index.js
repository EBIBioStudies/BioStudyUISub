/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.controller('DashboardCtrl', require('./../../views/dashboardCtrl'));
app.controller('SubmissionListCtrl', require('./../../views/submission/submissionListCtrl'));
app.controller('AddSubmissionCtrl', require('./../../views/submission/addSubmissionCtrl'));
app.controller('EditSubmissionCtrl', require('./../../views/submission/editSubmissionCtrl'));
app.controller('PublicationCtrl', require('./../../views/submission/PublicationCtrl'));

//app.controller('ImportCtrl', require('./importCtrl'));
app.controller('ExportCtrl', require('./exportCtrl'));
app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('FilesCtrl', require('./../../views/files/filesCtrl'));
app.controller('FilesTreeCtrl', require('./../../views/files/filesTreeCtrl'));
app.controller('FileCtrl', require('./../../views/submission/FileCtrl'));

module.exports=app;
