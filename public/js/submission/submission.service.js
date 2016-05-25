'use strict';

module.exports =
    (function () {

        return ['$http', '$q', function ($http, $q) {

            function getSubmissionList(options) {
                var defer = $q.defer();
                $http.get("/api/submissions", options)
                    .success(function (data) {
                        var submissions = [];
                        submissions = submissions.concat(data.submissions);
                        defer.resolve(submissions);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function getSubmission(accno, origin) {
                var defer = $q.defer();
                $http.get("/api/submission/" + accno, {params: {origin: origin === true}})
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function saveSubmission(submission) {
                var defer = $q.defer();
                $http.post("/api/submission/save", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function submitSubmission(submission) {
                var defer = $q.defer();
                $http.put("/api/submission/submit", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function createSubmission(submission) {
                var defer = $q.defer();
                $http.post("/api/submission/create", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function editSubmission(accno) {
                var defer = $q.defer();
                $http.post("/api/submission/edit/" + accno)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function deleteSubmission(accno) {
                var defer = $q.defer();
                $http.delete( "/api/submission/" + accno)
                    .success(function (data) {
                        if (data.status === "OK") {
                            defer.resolve(data);
                        } else {
                            defer.reject("delete error", data.status);
                        }
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            return {
                getAllSubmissions: getSubmissionList,
                getSubmission: getSubmission,
                getSubmittedSubmission: function(submission) {
                    return getSubmission(submission, true);
                },
                saveSubmission: saveSubmission,
                submitSubmission: submitSubmission,
                deleteSubmission: deleteSubmission,
                createSubmission: createSubmission,
                editSubmission: editSubmission
            }
        }];

    })();