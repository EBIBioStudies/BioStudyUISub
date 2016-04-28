/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports =
    (function () {

        return ['$scope', '$location', 'SubmissionService', '$uibModal', '$log', 'SubmissionModel',
            function ($scope, $location, SubmissionService, $uibModal, $log, SubmissionModel) {

                $scope.submissions = [];
                $scope.selectedSubmission = [];

                SubmissionService
                    .getAllSubmissions()
                    .then(function (result) {
                        $scope.submissions = result;
                    });

                function getFirstSelected() {
                    return $scope.selectedSubmission[0];
                }

                function startEditing(sub){
                    $location.url('/edit/' + sub.accno);
                }

                $scope.createSubmission = function () {
                    SubmissionService.createSubmission(SubmissionModel.createSubmission())
                        .then(function(sbm) {
                            startEditing(sbm);
                        });
                };

                $scope.editSubmission = function (submission) {
                    startEditing(submission || getFirstSelected());
                };

                $scope.deleteSubmission = function (submission) {
                    var modalInstance = $uibModal.open({
                        controller: 'MessagesCtrl',
                        templateUrl: 'templates/partials/confirmDialog.html',
                        backdrop: true,
                        size: 'lg'
                    });

                    modalInstance.result
                        .then(function () {
                            submission = submission || $scope.selectedSubmission;

                            if (submission) {
                                SubmissionService
                                    .deleteSubmission(submission.accno)
                                    .then(function () {
                                        angular.forEach($scope.submissions,
                                            function (value, index) {
                                                if (value.accno === submission.accno) {
                                                    $scope.submissions.splice(index, 1);
                                                }
                                            });
                                    })
                                    .catch(function () {
                                        //show error
                                    });
                            }
                        });
                };

            }];
    })();
