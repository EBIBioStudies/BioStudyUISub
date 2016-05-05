/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.controller('NavigationCtrl', require('./navigationCtrl'));
app.controller('AppCtrl', require('./appCtrl'));
app.controller('HomeCtrl', require('./homeCtrl'));
app.controller('HelpCtrl', require('./helpCtrl'));
app.controller('ErrorCtrl', require('./error/errorCtrl'));

app.controller('MessagesCtrl', require('./messagesCtrl'));

app.controller('DashboardCtrl', require('./dashboardCtrl'));

app.controller('FilesCtrl', require('./files/filesCtrl'));
app.controller('FilesTreeCtrl', require('./files/filesTreeCtrl'));

module.exports=app;
