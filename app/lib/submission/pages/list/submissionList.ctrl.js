export default class SubmissionListController {
    constructor($scope, $state, $log, SubmissionService, SubmissionModel, ModalDialogs, Session) {
        "ngInject";

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
            var sbm = SubmissionModel.create(Session.userName, Session.userEmail);
            SubmissionService.createSubmission(sbm)
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

        $scope.revertSubmission = function(submission) {
            $scope.deleteSubmission(submission, 'Discard all changes for the submission ' + submission.accno + '?');
        };

        $scope.deleteSubmission = function (submission, message) {
            message = message || 'Delete submission ' + submission.accno + '?';
            ModalDialogs
                .confirm([message])
                .then(function () {
                    SubmissionService
                        .deleteSubmission(submission.accno)
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
    }
}