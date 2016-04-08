'use strict';

module.exports =
    (function () {

        return ['$http', '$q', 'SharedData', '$log', function ($http, $q, SharedData, $log) {

            function getSubmission(accno) {
                var deffer = $q.defer();

                if (SharedData.getSubmission().id) {
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
                } else {
                    deffer.resolve(SharedData.getSubmission());
                }
                return deffer.promise;
            }

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

            return {
                getSubmission: getSubmission,
                getSubmissionList: getSubmissionList
            }
        }];

    })();