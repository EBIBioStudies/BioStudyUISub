/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';
var routing = require('../../../../.gen/config.json').routing;


module.exports = function ($scope, $http, $timeout, DataService, Upload, $log) {
    $scope.importMenu = true;
    $scope.title = 'Import';
    $scope.filesTree = [];
    var tree;
    $scope.uploadedTree = tree = {};
    $scope.selectedFiles = [];
    $scope.uploadUrl=routing.files.upload.url;
    $scope.fileTypes = {
        dir: 'DIR',
        file : 'FILE',
        archive : 'ARCHIVE',
        fileInArchive : 'FILE_IN_ARCHIVE'
    };

    $scope.expanding_property = {field: 'name', displayName: 'Name'};

    $scope.col_defs = [
        /*{   field: 'size', displayName: 'Size',
            cellTemplate:  '<span>{{row.branch[col.field]}} KB</span> '
        },*/
        {
            field: 'type', displayName: 'Type', sortable : false, filterable: true,
            cellTemplate: '<i class="fa" ng-class="{\'fa-file\' : row.branch[col.field]===\'FILE\', \'fa-folder\' : row.branch[col.field]===\'DIR\',' +
            '\'fa-archive\' : row.branch[col.field]===\'ARCHIVE\', \'fa-file-archive-o\' : row.branch[col.field]===\'FILE_IN_ARCHIVE\'}"/>'
        },
        /*{
            field: 'status', displayName: 'Status',
            cellTemplate: '<span><i class="fa" ng-class="{\'fa-check\' : (row.branch[\'type\']===\'FILE\' && row.branch.status===3),' +
            '\'fa-upload\':  (row.branch[\'type\']===\'FILE\' && row.branch.status===0)}"/> </span>'
        },*/
        {
            field: 'progress', displayName: 'Progress',
            cellTemplate: '<div ng-show="row.branch[\'type\']===\'FILE\' && row.branch[\'status\']!=3" class="progress"  ' +
                    'style="margin-bottom: 0;"> <div class="progress-bar" ng-class="{\'progress-bar-success\' : (row.branch.status==3)}" role="progressbar" ' +
                    'ng-style="{ \'width\': row.branch.progress + \'%\' }"> {{row.branch.progress+ "%"}}</div> </div>' +
                    '<div ng-show="row.branch[\'status\']==3"><i class="fa fa-check"></i></div>'
        },
        {
            displayName: 'Actions',
            cellTemplate: '<span ng-show="row.branch.status===1"><i class="fa fa-cog fa-spin"></i></span>' +
            '<button ng-show="row.branch[\'type\']===\'FILE\' && row.branch[\'status\']!=3" type="button" class="btn btn-warning btn-xs"' +
            'ng-click="row.branch.deleteFile(row.branch);">' +
            'Delete </button>' +
            '<button ng-show="row.branch[\'status\']==3 && ( row.branch[\'type\']===\'FILE\' || row.branch[\'type\']===\'ARCHIVE\')" type="button" class="btn btn-danger btn-xs"' +
            'ng-click="cellTemplateScope.deleteUploaded(row.branch)">' +
            'Delete </button>',
            cellTemplateScope: {
                deleteUploaded: function(data) {         // this works too: $scope.someMethod;
                    $scope.deleteUploaded(data);
                },
                deleteAdded: function(data) {
                    $scope.deleteAdded(data);
                }
            }

        }

    ];

    function decorateFiles(array, archive) {

        for (var i in array) {
            if (!array[i].status && array[i].type !== $scope.fileTypes.dir) {
                array[i].status = 3;
                array[i].progress = 100;
                if (archive) {
                    array[i].type = $scope.fileTypes.fileInArchive;
                }
            }
            if (array[i].files) {

                array[i].children = array[i].files;
                decorateFiles(array[i].files, array[i].type==='ARCHIVE');
            }
        }
    }

    $scope.id=0;

    function addSelectedFileToTree() {
        for (var i in $scope.selectedFiles) {
            if (!$scope.selectedFiles[i].fileTree) {
                var file = {
                    id : i,
                    path : '',
                    size: ($scope.selectedFiles[i].size/1024).toFixed(2),
                    name: $scope.selectedFiles[i].name,
                    type: 'FILE',
                    status: 0,
                    progress: 0,
                    upload : (function(file) {
                        var ctrlScope = $scope;
                        return function(_fileInTree) {
                            this.uploadPromise =
                                ctrlScope.uploadFile(file, _fileInTree, true);
                            console.log('upload', ctrlScope, file, true);
                        }
                    })($scope.selectedFiles[i]),
                    cancel : function(file) {
                        if (this.uploadPromise) {
                            uploadPromise.cancel();
                        }
                        console.log('cancel file', file);
                    },
                    deleteFile : (function(file) {
                     var ctrlScope = $scope;
                     return function(_fileInTree) {
                     $scope.filesTree.splice($scope.filesTree.indexOf(_fileInTree),1);
                     $scope.selectedFiles.splice($scope.selectedFiles.indexOf(file),1);
                     console.log('delete');
                     }
                     })($scope.selectedFiles[i])
                };
                $scope.selectedFiles[i].fileTree = file;
                $scope.filesTree.unshift(file);

            }

        }
        console.log($scope.filesTree, $scope.selectedFiles);
        $scope.uploadAll();



    }
    function getFiles() {
        var d = DataService.getFiles();
        d.then(function (data) {
            $scope.filesTree = data.files;
            if ($scope.filesTree[0]) {
                $scope.filesTree[0].name="Your uploaded files";
            }
            decorateFiles($scope.filesTree);
            $scope.rootFileInTree = $scope.filesTree[0];
            addSelectedFileToTree();
            $log.debug('Root',$scope.filesTree);
            //replace User:
            //add selected files
        });
    }

    getFiles();


    $scope.addFiles = function (_files) {
        console.log('Added files', _files);
        $scope.selectedFiles = _files;
        addSelectedFileToTree();
        //Decorate files
    };

    $scope.uploadFile = function (file, _fileInTree, refreshTree) {
        $log.debug('Uploading file');
        var u=Upload.upload({
            url:routing.files.upload.url,
            data: {file: file}
            }).then(function(resp) {
            // file is uploaded successfully
                _fileInTree.status = 3;
                _fileInTree.progress = 100;
                $scope.selectedFiles.splice(file.id,1);
                if (refreshTree) {
                    getFiles();
                }
                //remove from
        }, function(resp) {
            _fileInTree.status = 2;
            console.log('error ', resp);
            // handle error
        }, function(evt) {
            _fileInTree.status = 1;
            if (evt.total && evt.loaded) {
                var progress = parseInt(100.0 * evt.loaded / evt.total);
                if (progress>=99) {
                    progress=99;
                }
                _fileInTree.progress = progress;
            }
        });
    };

    $scope.uploadAll = function () {
        $log.debug('Upload all', $scope.selectedFiles);
        for (var i in $scope.selectedFiles) {
            $log.debug('Upload all', i);
            $scope.uploadFile($scope.selectedFiles[i],$scope.selectedFiles[i].fileTree, true);
        }
    };

    $scope.deleteUploaded = function (row) {
        console.log('Delete files');
        console.log('delete', row);
        //call service to delete file
        DataService.deleteFile(row).then(function() {
            getFiles();
        });

    }

    $scope.addFilesHandler = function( $files, $event, $flow ) {
        console.log('Files added', $files, $event, $flow);
        for (var i in $files) {
            var file = {
                id : i,
                path : '',
                size: ($files[i].size/1024).toFixed(2),
                name: $files[i].name,
                type: 'FILE',
                status: 0,
                progress: 0,
                flowFile: $files[i]
            }
            $scope.filesTree.unshift(file);
            //$scope.upload();

        }
    };

    $scope.submittedHandler = function($files, $event, $flow) {
      console.log('submitted');
    };



};

