/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $location, $log, DataService, SharedData, $uibModal) {
    $scope.submissions=[];
    $scope.selectedSubmission=[];


    DataService.getSubmissions({}).then(function(data) {
        $scope.submissions = data;

        //angular.forEach($scope.submissions, function(value, key) {
        //$scope.submissions[key].rtime *= 1000;
        //});
    }, function(err) {
        //should return the message page
    });

    function getCurrentSubmission(submission) {
        return submission || $scope.selectedSubmission[0];
    }

    $scope.editSubmission = function(submission) {
        var sub = getCurrentSubmission(submission);
        $log.debug('Click edit submission', submission, sub);

        if (sub) {
            SharedData.submission=sub;
            $location.url('/edit/' + sub.accno);
        }
    };

    $scope.deleteSubmission = function(submission) {
        var modalInstance = $uibModal.open({
            controller : 'MessagesCtrl',
            templateUrl: 'templates/partials/confirmDialog.html',
            backdrop:true,
            size: 'lg'
        });

        modalInstance.result.then(function (selectedItem) {
            submission = submission || $scope.selectedSubmission;
            $log.debug('Deleting the submission', submission);

            if (submission) {
                DataService.delete(submission).then(function() {
                    angular.forEach($scope.submissions, function(value, index) {
                        if (value.id===submission.id) {
                            $log.debug('Deleting the submission', value);
                            $scope.submissions.splice(index, 1);

                        }
                    });
                }).catch(function() {
                    //show error
                });
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });


    };

};
