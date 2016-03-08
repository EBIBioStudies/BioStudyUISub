/**
 * Created by mdylag on 03/09/2014.
 * Load controllers
 *
 */
'use strict';
var app = angular.module('BioStudyApp');

//Add service
app.controller('SignInCtrl', require('./signInCtrl'));
app.controller('SignUpCtrl', require('./signUpCtrl'));
module.exports=app;


