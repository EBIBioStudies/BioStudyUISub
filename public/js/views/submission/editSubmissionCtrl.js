/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';


module.exports =
    function($rootScope, $scope, $timeout, $interval, $location,
             $uibModal, $injector, $routeParams, $log,$anchorScroll, SharedData, ModuleHelper,submissionDecorator) {

        var DataService =$injector.get('DataService'),
            MessageService =$injector.get('MessageService'),
            SubmissionModel = $injector.get('SubmissionModel');

        submissionDecorator.create($scope);
        $scope.mode=$rootScope.Constants.FormMode.EDIT;
        $scope.title='Edit the submission ' + $routeParams.accno;

        var saveInterv;
        $scope.$on("$destroy", function(){
            console.log('destroy');
            $interval.cancel(saveInterv);
        });


        if ($routeParams.accno) {
            $log.debug('Edit the submission ', $routeParams);
            DataService.getSubmission($routeParams.accno).then(function(data) {
                ModuleHelper.setData(data);
                $scope.submission=ModuleHelper.model.submission;
                $scope.viewSubmission=ModuleHelper.model.viewSubmission;
                $scope.submModel=ModuleHelper.model;
                //$scope.viewSubmission.contacts=ModuleHelper.unionKeys($scope.submission.section.subsections, _keys.contact.type);
                $log.debug('Date recevied', data);

                $scope.curentSectionForFiles=$scope.submission.section;
                if (!$scope.submission.id) {
                    saveInterv = $interval(function () {
                        //console.log('Save');
                        $scope.save();
                    }, 10000);
                }
            }).catch(function(err) {
                $log.debug('Error data',err);
                $location.url('/error');
            });

        } else {
           $location.url('/error');
        }


        $scope.hasError=false;

        var timeout;
        var saveInProgress=false;

        //$scope.$watch('submission', watchSubmission, true);

        $scope.save = function() {
            //generate id
            console.log('save',$location.path());

            if ($scope.submission.id ) {
                $interval.cancel(saveInterv);
                //remove autosave
            } else {

                DataService.saveUserData($scope.submModel.submission).then(function success(data) {
                    $scope.submission.accno = data.accno;
                });
            }
        };
        //Update data
        $scope.submit = function(submissionForm) {
            //
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.submissionForm.$invalid) {
                $log.debug('Validation error', $scope.submissionForm);
                return;
            }
            $log.debug('Submit data', $scope.submModel.submission);
            DataService.update($scope.submModel.submission).then(function(data) {
                var acc = $scope.submModel.submission.accno;
                MessageService.addMessage('Submission ' + acc + ' updated.');
                $interval.cancel(saveInterv);
                var modalInstance = $uibModal.open({
                    controller : 'MessagesCtrl',
                    templateUrl: 'templates/partials/successDialog.html',
                    backdrop:true,
                    size: 'lg'
                });
                /*$timeout(function() {
                 modalInstance.close();
                 },6000);*/
                modalInstance.result.then(function() {
                    $log.debug('Created ' + acc);
                },function() {
                    $log.debug('Created');
                });


            }).catch(function(err, status) {
                $log.debug('Created error', err, status);

                MessageService.setErrorType();
                MessageService.addMessage('Server error '+ status + ' ' + err);
                var modalInstance = $uibModal.open({
                    controller : 'MessagesCtrl',
                    templateUrl: 'myModalContentError.html',
                    windowTemplateUrl: 'myModalWindow.html',
                    backdrop:true,
                    size: 'lg'
                });
                $timeout(function() {
                    modalInstance.close();
                    MessageService.clearMessages();
                },6000);
                modalInstance.result.then(function() {
                    MessageService.clearMessages();
                });
            });

        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };


        $scope.getParentSection = function(parent) {
            return parent || $scope.submission;
        };

        $scope.addAnnotation = function(parent) {
            $log.debug('Add an annotation from controller', parent);
            SubmissionModel.addItemToArray(parent.attributes, SubmissionModel.createAttribute);
            scrollTo('annotations');
        };

        $scope.addAttributeTo = function(parent) {
            var attr= SubmissionModel.createAttribute();
            $scope.viewSubmission.contacts.attributesKey(attr);
            SubmissionModel.addAttributeTo(parent, SubmissionModel.createAttribute(), 'conract');

        };


    };
