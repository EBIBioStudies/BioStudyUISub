export default class SubmissionService {
    constructor($http, $q) {
        "ngInject";

        Object.assign(this, {
            getAllSubmissions(options) {
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
            },

            getSubmission(accno, origin) {
                var defer = $q.defer();
                $http.get("/api/submission/" + accno, {params: {origin: origin === true}})
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            },
            getSubmittedSubmission(submission) {
                return this.getSubmission(submission, true);
            },
            saveSubmission(submission) {
                var defer = $q.defer();
                $http.post("/api/submission/save", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            },

            submitSubmission(submission) {
                var defer = $q.defer();
                $http.put("/api/submission/submit", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            },

            createSubmission(submission) {
                var defer = $q.defer();
                $http.post("/api/submission/create", submission)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            },

            editSubmission(accno) {
                var defer = $q.defer();
                $http.post("/api/submission/edit/" + accno)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (err, status) {
                        defer.reject(err, status);
                    });
                return defer.promise;
            },

            deleteSubmission(accno) {
                var defer = $q.defer();
                $http.delete("/api/submission/" + accno)
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

        });
    }
}