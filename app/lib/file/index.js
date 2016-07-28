import angular from 'angular'

import 'ng-file-upload'

import treeGrid from '../treeGrid/index'

import FileService from './file.service'
import FileListCtrl from './pages/list/fileList.ctrl'

export default angular.module('BioStudyApp.File', ['ngFileUpload', treeGrid.name])
    .service('FileService', FileService)
    .controller('FilesCtrl', FileListCtrl);
