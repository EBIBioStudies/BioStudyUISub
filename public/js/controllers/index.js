/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';
var app = angular.module('BioStudyApp');
app.service('submissionDecorator',require('../views/submission/submissionDecorator'));
app.controller('NavigationCtrl', require('./navigationCtrl'));
app.controller('MainCtrl', require('./../views/mainCtrl'));
app.controller('HomeCtrl', require('./../views/homeCtrl'));
app.controller('HelpCtrl', require('./../views/helpCtrl'));
app.controller('ErrorCtrl', require('./../views/error/errorCtrl'));

app.controller('MessagesCtrl', require('./messagesCtrl'));

module.exports=app;
