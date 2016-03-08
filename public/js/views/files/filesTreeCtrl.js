'use strict';

module.exports = function($http, $scope, $log, $uibModalInstance, DataService) {
    console.log('Files');
    $scope.selected = {};
    $scope.selectFile = function (branch) {
        $scope.selected = branch;
        console.log('selected', branch);
    };

    $scope.chooseFile = function () {
        console.log('choose');
        $uibModalInstance.close($scope.selected);
    };


    $scope.expanding_property = {field: 'name', displayName: 'Name'};
    $scope.col_defs = [{field: 'size', displayName: 'Size'},
        {
            field: 'type', displayName: 'Type',
            cellTemplate: '<i class="fa" ng-class="{\'fa-file\' : row.branch[col.field]===\'FILE\', \'fa-folder\' : row.branch[col.field]!==\'FILE\'}"/> '
        }];
    $scope.files = [];

    function renameToChildren(array) {
        for (var i in array) {
            if (array[i].files) {
                array[i].children = array[i].files;
                renameToChildren(array[i].files);
            }
        }
    }

    function getFiles() {
        var d=DataService.getFiles();
        d.then(function (data) {
            $scope.files = data.files;
            renameToChildren($scope.files);
            $log.debug($scope.files);
        });
    }

    getFiles();

};