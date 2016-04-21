/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var moduleHelper2 = require('../../model/modelHelper2');

module.exports =
    function ($rootScope, $scope, $timeout, $interval, $location,
              $uibModal, $routeParams, $log, $anchorScroll, ModuleHelper, submissionDecorator,
              SubmissionService, MessageService, SubmissionModel) {

        submissionDecorator.create($scope);
        $scope.mode = $rootScope.Constants.FormMode.EDIT;
        $scope.title = 'Edit the submission ' + $routeParams.accno;
        $scope.hasError = false;

        var saveInterv = null;
        var savedSubmission;

        function startSaving(str) {
            savedSubmission = str;
            saveInterv = $interval(function () {
                $scope.save();
            }, 5000);
        }

        function stopSaving() {
            if (saveInterv) {
                $interval.cancel(saveInterv);
                saveInterv = null;
            }
        }

        $scope.$on("$destroy", function () {
            console.log('destroy');
            stopSaving();
        });

        if ($routeParams.accno) {
            $log.debug('Edit the submission ', $routeParams);
            SubmissionService.getSubmission($routeParams.accno)
                .then(function (sbm) {

                    $scope.sbm = sbm;
                    $scope.submission = SubmissionModel.createSubmission(sbm.data);
                    $scope.submHelper = moduleHelper2.createSubmModel($scope.submission);
                    $scope.curentSectionForFiles = $scope.submission.section;

                    startSaving(angular.toJson($scope.submission));

                }).catch(function (err) {
                    $log.debug('Error data', err);
                    $location.url('/error');
                });
        } else {
            $location.url('/error');
        }

        $scope.save = function () {
            var currentSubmission = angular.toJson($scope.submission);
            if (currentSubmission != savedSubmission) {
                stopSaving();
                var sbm = $scope.sbm;
                sbm.data = $scope.submission;
                SubmissionService.saveSubmission(sbm)
                    .then(function () {
                        $log.debug("edit_submission: changes saved", $scope.submission);
                        startSaving(currentSubmission);
                    });
            }
        };

        $scope.submit = function (submissionForm) {
            //
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.submissionForm.$invalid) {
                $log.debug('Validation error', $scope.submissionForm);
                return;
            }
            $log.debug('Submit data', $scope.submission);
            SubmissionService.submitSubmission($scope.submission).then(function (data) {
                var acc = $scope.submission.accno;
                MessageService.addMessage('Submission ' + acc + ' updated.');
                $interval.cancel(saveInterv);
                var modalInstance = $uibModal.open({
                    controller: 'MessagesCtrl',
                    templateUrl: 'templates/partials/successDialog.html',
                    backdrop: true,
                    size: 'lg'
                });
                /*$timeout(function() {
                 modalInstance.close();
                 },6000);*/
                modalInstance.result.then(function () {
                    $log.debug('Created ' + acc);
                }, function () {
                    $log.debug('Created');
                });


            }).catch(function (err, status) {
                $log.debug('Created error', err, status);

                MessageService.setErrorType();
                MessageService.addMessage('Server error ' + status + ' ' + err);
                var modalInstance = $uibModal.open({
                    controller: 'MessagesCtrl',
                    templateUrl: 'myModalContentError.html',
                    windowTemplateUrl: 'myModalWindow.html',
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
            });


        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };


        $scope.getParentSection = function (parent) {
            return parent || $scope.submission;
        };

        $scope.addAttributeTo = function (parent) {
            var attr = SubmissionModel.createAttribute();
            $scope.viewSubmission.contacts.attributesKey(attr);
            SubmissionModel.addAttributeTo(parent, SubmissionModel.createAttribute(), 'conract');

        };

    };
