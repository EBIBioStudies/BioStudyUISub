/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.service('submissionDecorator',require('./submission/submissionDecorator'));
app.controller('NavigationCtrl', require('./navigationCtrl'));
app.controller('MainCtrl', require('./mainCtrl'));
app.controller('HomeCtrl', require('./homeCtrl'));
app.controller('HelpCtrl', require('./helpCtrl'));
app.controller('ErrorCtrl', require('./error/errorCtrl'));

app.controller('MessagesCtrl', require('./messagesCtrl'));

app.controller('SignInCtrl', require('./auth/signInCtrl'));
app.controller('SignUpCtrl', require('./auth/signUpCtrl'));
app.controller('ActivateCtrl',require('./auth/activateCtrl'));

app.controller('DashboardCtrl', require('./dashboardCtrl'));
app.controller('SubmissionListCtrl', require('./submission/submissionListCtrl'));
app.controller('AddSubmissionCtrl', require('./submission/addSubmissionCtrl'));
app.controller('EditSubmissionCtrl', require('./submission/editSubmissionCtrl'));
app.controller('PublicationCtrl', require('./submission/PublicationCtrl'));

//app.controller('ImportCtrl', require('./importCtrl'));
//app.controller('ExportCtrl', require('./exportCtrl'));
//app.controller('ProfileCtrl', require('./profileCtrl'));
app.controller('FilesCtrl', require('./files/filesCtrl'));
app.controller('FilesTreeCtrl', require('./files/filesTreeCtrl'));
app.controller('FileCtrl', require('./submission/FileCtrl'));

module.exports=app;
