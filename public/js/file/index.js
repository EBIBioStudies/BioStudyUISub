'use strict';

angular.module('BioStudyApp')
    .service('FileService', require('./file.service'))
    .controller('FilesCtrl', require('./views/files.ctrl'))
    .controller('FilesTreeCtrl', require('./views/filesTree.ctrl'));
