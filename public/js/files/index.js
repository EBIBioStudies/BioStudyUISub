'use strict';

var app = angular.module('BioStudyApp');

app.factory('FileService', require('./file.service'));
app.controller('FilesCtrl', require('./views/files.ctrl'));
app.controller('FilesTreeCtrl', require('./views/fileTree.ctrl'));
