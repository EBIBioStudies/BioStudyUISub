'use strict';

module.exports =
    (function () {

        return ['$http', '$q', function ($http, $q) {

            function getFiles() {
                var defer = $q.defer();

                $http.get("/api/files/dir")
                    .success(function (data) {
                        defer.resolve(data);
                    }).error(function (err, status) {
                        console.log('Error get files', err);
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function deleteFile(file) {
                var defer = $q.defer();

                $http.delete("/api/files/delete?file=" + file.name)
                    .success(function (data) {
                        defer.resolve(data);
                    }).error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            return {
                getFiles: getFiles,
                deleteFile: deleteFile
            }

        }];
    })();