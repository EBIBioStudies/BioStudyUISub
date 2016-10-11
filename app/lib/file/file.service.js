export default class FileService {
    constructor($http, $q) {
        "ngIngect";

        function cutOffUserRoot(obj) {
            if (!angular.isObject(obj)) {
                return;
            }
            if (obj.path) {
                obj.path = obj.path.replace(/^(\/User\/)/, "");
            }
            angular.forEach(obj, function (item) {
                cutOffUserRoot(item);
            });
        }


        function getFiles() {
            var defer = $q.defer();

            $http.get("/api/files/dir")
                .success(function (data) {
                    if (data.files) {
                        cutOffUserRoot(data.files[0].files);
                    }
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

        Object.assign(this, {
            getFiles: getFiles,
            deleteFile: deleteFile
        });
    }
}