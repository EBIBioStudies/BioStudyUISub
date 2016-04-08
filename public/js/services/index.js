/**
 * Created by mdylag on 03/09/2014.
 */
'use strict';

var app = angular.module('BioStudyApp');

app.service('DataService', require('./DataService'));
app.service('MessageService', require('./MessageService'));
app.factory('ErrorService', require('./ErrorService'));

app.service('EditSubmissionService', require('./SubmissionService'));

app.service('EuropePmc', require('./EuropePmc'));

app.service('TypeHeadService', require('./TypeHeadService'));
app.service('msTreeService', require('./msTreeService'));

app.provider('bsShowErrorsConfig',require('./bsShowErrorsConfig'));
module.exports=app;
