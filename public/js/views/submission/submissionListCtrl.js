/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports =
    (function () {

        return ['$scope', '$location', 'SubmissionService', 'SharedData', '$uibModal', '$log',
            function ($scope, $location, SubmissionService, SharedData, $uibModal, $log) {

                $scope.submissions = [];
                $scope.selectedSubmission = [];

                SubmissionService
                    .getSubmissionList()
                    .then(function (result) {
                        $scope.submissions = result;
                    });

                function getFirstSelected() {
                    return $scope.selectedSubmission[0];
                }

                $scope.editSubmission = function (submission) {
                    var sub = submission || getFirstSelected();
                    if (sub) {
                        SharedData.setSubmission(sub);
                        $location.url('/edit/' + sub.accno);
                    }
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
                                    .delete(submission)
                                    .then(function () {
                                        angular.forEach($scope.submissions,
                                            function (value, index) {
                                                if (value.id === submission.id) {
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
