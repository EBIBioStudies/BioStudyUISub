/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.controller('ErrorCtrl', require('./error/errorCtrl'));

app.controller('MessagesCtrl', require('./messagesCtrl'));

app.controller('DashboardCtrl', require('./dashboardCtrl'));

module.exports=app;
