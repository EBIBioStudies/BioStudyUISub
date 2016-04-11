'use strict';


module.exports = function ($scope, $log, FileService) {
    console.log('File Ctrl');
    $scope.files = [];
    function processFiles(data, array) {
        for (var i in data) {
            if (data[i].type == 'FILE') {
                array.push(data[i].path);
            } else if (data[i].type == 'DIR') {
                processFiles(data[i].files, array);
            }
        }
        return array;
    }

    function getFiles() {
        var d = FileService.getFiles();
        d.then(function (data) {
            processFiles(data.files, $scope.files);
        });
    }

    getFiles();
};