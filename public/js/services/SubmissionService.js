'use strict';

module.exports =
    (function () {

        return ['$http', '$q', function ($http, $q) {

/*
            function removeParent(submission) {
                angular.forEach(submission.sections, function(section, index) {
                    delete section.parent;
                    removeParent(section);
                });
            }
*/

            function getSubmissionList(options) {
                var deffer = $q.defer();

                $http.get("/api/submissions", options)
                    .then(function (response) {
                        if (response.status === 200) {
                            var submissions = [];
                            submissions = submissions.concat(response.data.submissions);
                            deffer.resolve(submissions);
                        } else {
                            deffer.reject(response);
                        }
                    }, function (err) {
                        deffer.reject(err);
                    });
                return deffer.promise;
            }

            function getSubmission(accno) {
                var deffer = $q.defer();

                $http.get("/api/submission/" + accno)
                    .then(function (response) {
                        if (response.status === 200) {
                            deffer.resolve(response.data);
                        } else {
                            deffer.reject(response);
                        }
                    }, function (err) {
                        deffer.reject(err);
                    });
                return deffer.promise;
            }

            function saveSubmission(submission) {
                var deffer = $q.defer();
                console.log('saveSubmission', submission);
                $http.post("/api/submission/save", submission)
                    .then(function (response) {
                        if (response.status === 200) {
                            deffer.resolve(response.data);
                        } else {
                            deffer.reject(response);
                        }
                    }, function (err) {
                        console.log('Error to save data', err);
                        deffer.reject(err);
                    });
                return deffer.promise;
            }

            function submitSubmission(submission) {
                var defer = $q.defer();

                $http.put("/api/submission/submit", submission)
                    .success(function(data) {
                        defer.resolve(data);
                    }).error(function(err, status){
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function createSubmission(submission) {
                var defer = $q.defer();
                $http.post("/api/submission/create", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    }).error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            function deleteSubmission(submission) {
                var defer = $q.defer();
                var url = '';
                if (submission.id) {
                    url = '/api/submission/submitted/delete/' + submission.accno;
                } else {
                    url = '/api/submission/delete/' + submission.accno;
                }
                $http.delete(url)
                    .success(function (data) {
                        defer.resolve(data);
                    }).error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            }

            return {
                getAllSubmissions: getSubmissionList,
                getSubmission: getSubmission,
                saveSubmission: saveSubmission,
                submitSubmission: submitSubmission,
                deleteSubmission: deleteSubmission,
                createSubmission: createSubmission
            }
        }];

    })();