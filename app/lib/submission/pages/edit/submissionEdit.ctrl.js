export default class SubmissionEditController {
    constructor($scope, $timeout, $state,
                $stateParams, $log, SubmissionModel, SubmissionService, ModalDialogs) {
        "ngInject";

        $scope.accno = '';
        $scope.hasError = false;
        $scope.readOnly = false;
        $scope.submission = null;
        $scope.saving = false;

        $scope.onSubmissionChange = function () {
            if ($scope.submission !== null) {
                $log.debug("onSubmissionChange()");
                debounceSaveUpdates();
            }
        };

        var timeout = null;
        var saved = null;
        var submissionUnwatch = null;

        function watchSubmission(listener) {
            return $scope.$watchGroup([
                'submission.title',
                'submission.releaseDate',
                'submission.description'], listener);
        }

        function saveUpdates() {
            $log.debug("saveUpdates()");
            var exported = SubmissionModel.export($scope.submission);
            var exportedJson = angular.toJson(exported);
            if (saved !== exportedJson) {
                $scope.saving = true;
                $log.debug("saved: " + saved);
                $log.debug("exported: " + exportedJson);
                var sbm = $scope.sbm;
                sbm.data = exported;
                SubmissionService.saveSubmission(sbm)
                    .then(function () {
                        $log.debug("submission saved");
                        $scope.saving = false;
                        saved = exportedJson;
                    });
            } else {
                $log.debug("all saved already");
            }
        }

        function debounceSaveUpdates(newVal, oldVal) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(saveUpdates, 1000);
        }

        $scope.$on("$destroy", function () {
            if (submissionUnwatch) {
                submissionUnwatch();
                submissionUnwatch = null;
            }
        });

        SubmissionService.editSubmission($stateParams.accno)
            .then(function (sbm) {

                $scope.sbm = sbm;
                $scope.submission = SubmissionModel.import(sbm.data);
                $scope.accno = $scope.sbm.accno;
                saved = angular.toJson(SubmissionModel.export($scope.submission));
                submissionUnwatch = watchSubmission(debounceSaveUpdates);
            });

        $scope.submit = function () {
            if ($scope.submissionForm.$invalid) {
                $log.error('SubmissionForm is invalid');
                return;
            }

            var errors = SubmissionModel.validate($scope.submission);
            if (errors.length > 0) {
                showSubmitFailed(errors);
                return;
            }
            var sbm = $scope.sbm;
            sbm.data = SubmissionModel.export($scope.submission);
            $log.debug('Submit data', sbm);

            SubmissionService.submitSubmission(sbm)
                .then(function (data) {
                    if (data.status === "OK") {
                        showSubmitSuccess();
                    } else {
                        $log.debug("failed to submit", data);
                        showSubmitFailed(['Failed to submit.']);
                    }
                });
        };

        function showSubmitSuccess() {
            var acc = $scope.submission.accno;
            ModalDialogs.successMessages(['Submission ' + acc + ' has been submitted successfully.'])
                .then(function () {
                    $state.go('submissions');
                });
        }

        function showSubmitFailed(errors) {
            ModalDialogs.errorMessages(errors, "Submission validation failed")
                .then(function () {
                    // do nohtig;
                });
        }

        $scope.addAnnotation = function () {
            this.submission.annotations.items[0].attributes.addNew();
        };

        $scope.addFile = function () {
            this.submission.files.addNew();
        };

        $scope.addLink = function () {
            this.submission.links.addNew();
        };

        $scope.addContact = function () {
            this.submission.contacts.addNew();
        };

        $scope.addPublication = function () {
            this.submission.publications.addNew();
        };

        $scope.openDatePicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

    }
}