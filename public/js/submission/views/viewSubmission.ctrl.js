'use strict';

module.exports =
    function ($scope, $state, $stateParams, $log, SubmissionModel, SubmissionService) {

        $scope.title = 'View the submission';
        $scope.accno = '';
        $scope.readOnly = true;

        SubmissionService.getSubmittedSubmission($stateParams.accno)
            .then(function (sbm) {
                $scope.submission = SubmissionModel.import(sbm.data);
                $scope.accno = sbm.accno;

            }).catch(function (err) {
            $log.debug('Error data', err);
            $state.go('error');
        });

        $scope.editSubmission = function() {
           $state.go('submission_edit', {accno: $scope.accno});
        };
    };