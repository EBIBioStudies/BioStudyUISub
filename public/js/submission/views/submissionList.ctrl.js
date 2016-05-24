/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports =
    (function () {

        return ['$scope', '$state', 'SubmissionService', '$uibModal', '$log', 'SubmissionModel',
            function ($scope, $state, SubmissionService, $uibModal, $log, SubmissionModel) {

                $scope.submissions = [];
                $scope.selectedSubmission = [];

                function loadSubmissions() {
                    SubmissionService
                        .getAllSubmissions()
                        .then(function (result) {
                            $scope.submissions = result;
                        });
                }

                function startEditing(accno) {
                    $state.go('submission_edit', {accno: accno});
                }

                $scope.createSubmission = function () {
                    SubmissionService.createSubmission(SubmissionModel.create())
                        .then(function (sbm) {
                            startEditing(sbm.accno);
                        });
                };

                $scope.editSubmission = function (submission) {
                    startEditing(submission.accno);
                };

                $scope.viewSubmission = function (submission) {
                    $state.go('submission_view', {accno: submission.accno});
                };

                $scope.deleteSubmission = function (submission, copyOnly) {
                    var modalInstance = $uibModal.open({
                        controller: 'MessagesCtrl',
                        templateUrl: 'templates/partials/confirmDialog.html',
                        backdrop: true,
                        size: 'lg'
                    });

                    modalInstance.result
                        .then(function () {
                            SubmissionService
                                .deleteSubmission(submission.accno, copyOnly)
                                .then(function (data) {
                                    loadSubmissions();
                                })
                                .catch(function () {
                                    $log.error("submission delete failed");
                                    //todo show error
                                });
                        });
                };

                loadSubmissions();
            }];
    })();
