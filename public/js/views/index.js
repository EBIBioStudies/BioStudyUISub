/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.service('submissionDecorator',require('./submission/submissionDecorator'));
app.controller('NavigationCtrl', require('./navigationCtrl'));
app.controller('HomeCtrl', require('./homeCtrl'));
app.controller('HelpCtrl', require('./helpCtrl'));
app.controller('ErrorCtrl', require('./error/errorCtrl'));

app.controller('MessagesCtrl', require('./messagesCtrl'));


app.controller('DashboardCtrl', require('./dashboardCtrl'));
app.controller('PublicationCtrl', require('./submission/PublicationCtrl'));
app.controller('FileCtrl', require('./submission/FileCtrl'));

//app.controller('ImportCtrl', require('./importCtrl'));
//app.controller('ExportCtrl', require('./exportCtrl'));
//app.controller('ProfileCtrl', require('./profileCtrl'));

module.exports=app;
