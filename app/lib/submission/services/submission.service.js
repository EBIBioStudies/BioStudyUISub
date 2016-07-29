export default class SubmissionService {
    constructor($http, $q) {
        "ngInject";

        Object.assign(this, {
            getAllSubmissions(options) {
                return $http.get("/api/submissions", options)
                    .then(function (response) {
                            return response.data.submissions;
                        },
                        function (response) {
                            $log.error("getAllSubmissions() error: ", response);
                            return response;
                        })
            },

            getSubmission(accno, origin) {
                return $http.get("/api/submission/" + accno, {params: {origin: origin === true}})
                    .then(function (response) {
                            return response.data;
                        },
                        function (response) {
                            $log.error("getSubmission() error: ", response);
                            return response;
                        });
            },

            getSubmittedSubmission(submission) {
                return this.getSubmission(submission, true);
            },

            saveSubmission(submission) {
                return $http.post("/api/submission/save", submission)
                    .then(function (response) {
                            return response.data;
                        },
                        function (response) {
                            $log.error("saveSubmission() error: ", response);
                            return response;
                        });
            },

            submitSubmission(submission) {
                return $http.put("/api/submission/submit", submission)
                    .then(function (response) {
                            return response.data;
                        },
                        function (response) {
                            $log.error("submitSubmission() error: ", response);
                            return response;
                        });
            },

            createSubmission(submission) {
                return $http.post("/api/submission/create", submission)
                    .then(function (response) {
                            return response.data;
                        },
                        function (response) {
                            $log.error("createSubmission() error: ", response);
                            return response;
                        });
            },

            editSubmission(accno) {
                return $http.post("/api/submission/edit/" + accno)
                    .then(function (response) {
                            return response.data;
                        },
                        function (response) {
                            $log.error("editSubmission(accno=" + accno + ") error:", response);
                            return response;
                        });
            },

            deleteSubmission(accno) {
                var defer = $q.defer();
                $http.delete("/api/submission/" + accno)
                    .then(function (response) {
                        var data = response.data;
                        if (data.status === "OK") {
                            defer.resolve(data);
                        } else {
                            $log.error("deleteSubmission(accno=" + accno + ") error:", data);
                            defer.reject("delete error", data);
                        }
                    }, function (response) {
                        $log.error("deleteSubmission() error: ", response);
                        defer.reject("delete error", {status: "FAILED", message: "Server error"});
                    });
                return defer.promise;
            }
        });
    }
}