/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports =
    function ($rootScope, $scope, $timeout, $interval, $location,
              $uibModal, $stateParams, $log, SubmissionModel, SubmissionService, MessageService) {

        $scope.title = 'Edit the submission ' + $stateParams.accno;
        $scope.hasError = false;
        $scope.onSubmissionChange = function() {
            $log.debug("onSubmissionChange()");
            debounceSaveUpdates();
        }

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
            $log.debug("saveUpdatess()");
            var exported = SubmissionModel.export($scope.submission);
            var exportedJson = angular.toJson(exported);
            if (saved !== exportedJson) {
                $log.debug("saved: " + saved);
                $log.debug("exported: " + exportedJson);
                var sbm = $scope.sbm;
                sbm.data = exported;
                SubmissionService.saveSubmission(sbm)
                    .then(function () {
                        $log.debug("submission saved");
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

        SubmissionService.getSubmission($stateParams.accno)
            .then(function (sbm) {

                $scope.sbm = sbm;
                $scope.submission = SubmissionModel.import(sbm.data);
                saved = angular.toJson(SubmissionModel.export($scope.submission));
                submissionUnwatch = watchSubmission(debounceSaveUpdates);

            }).catch(function (err) {
            $log.debug('Error data', err);
            $location.url('/error');
        });

        $scope.submit = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.submissionForm.$invalid) {
                $log.debug('Validation error', $scope.submissionForm);
                return;
            }
            $log.debug('Submit data', $scope.submission);
            var sbm = $scope.sbm;
            sbm.data = $scope.submission;
            SubmissionService.submitSubmission(sbm)
                .then(function (data) {
                    if (data.status === "OK") {
                        showSubmitSuccess(data);
                    } else {
                        var log = angular.toJson(data, true);
                        showSubmitError(log);
                    }
                }).catch(function (err, status) {
                showSubmitError('Server error ' + status + ' ' + err);
            });
        };

        function showSubmitSuccess(data) {
            var acc = $scope.submission.accno;
            MessageService.addMessage('Submission ' + acc + ' updated.');

            var modalInstance = $uibModal.open({
                controller: 'MessagesCtrl',
                templateUrl: 'templates/partials/successDialog.html',
                backdrop: true,
                size: 'lg'
            });

            $timeout(function () {
                modalInstance.close();
                MessageService.clearMessages();
            }, 6000);
            modalInstance.result.then(function () {
                MessageService.clearMessages();
            });
        }

        function showSubmitError(data) {
            MessageService.addMessage(data);
            var modalInstance = $uibModal.open({
                controller: 'MessagesCtrl',
                templateUrl: 'templates/partials/successDialog.html',
                backdrop: true,
                size: 'lg'
            });
            $timeout(function () {
                modalInstance.close();
                MessageService.clearMessages();
            }, 6000);
            modalInstance.result.then(function () {
                MessageService.clearMessages();
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
    };
