export default class SubmissionService {
    constructor($http, $q, $log) {
        "ngInject";

        Object.assign(this, {
            getAllSubmissions(options) {
                return $http.get("/api/submissions", options)
                    .then((response) => {
                            return response.data.submissions;
                        },
                        (response) => {
                            $log.error("getAllSubmissions() error: ", response);
                            return $q.reject(response);
                        })
            },

            getSubmission(accno, origin) {
                return $http.get("/api/submission/" + accno, {params: {origin: origin === true}})
                    .then((response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("getSubmission() error: ", response);
                            return $q.reject(response);
                        });
            },

            getSubmittedSubmission(submission) {
                return this.getSubmission(submission, true);
            },

            saveSubmission(submission) {
                return $http.post("/api/submission/save", submission)
                    .then((response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("saveSubmission() error: ", response);
                            return $q.reject(response);
                        });
            },

            submitSubmission(submission) {
                return $http.put("/api/submission/submit", submission)
                    .then((response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("submitSubmission() error: ", response);
                            return $q.reject(response);
                        });
            },

            createSubmission(submission) {
                return $http.post("/api/submission/create", submission)
                    .then((response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("createSubmission() error: ", response);
                            return $q.reject(response);
                        });
            },

            editSubmission(accno) {
                return $http.post("/api/submission/edit/" + accno)
                    .then((response) => {
                            return response.data;
                        },
                        (response) => {
                            $log.error("editSubmission(accno=" + accno + ") error:", response);
                            return $q.reject(response);
                        });
            },

            deleteSubmission(accno) {
                return $http.delete("/api/submission/" + accno)
                    .then((response) => {
                        var data = response.data;
                        if (data.status === "OK") {
                            return data;
                        } else {
                            $log.error("deleteSubmission(accno=" + accno + ") error:", data);
                            return $q.reject("delete error", data);
                        }
                    }, (response) => {
                        $log.error("deleteSubmission() error: ", response);
                        return $q.reject("delete error", {status: "FAILED", message: "Server error"});
                    });
            }
        });
    }
}