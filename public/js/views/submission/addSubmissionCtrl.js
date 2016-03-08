/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports =
    function($rootScope, $scope, $http, $timeout, $interval, $location,
             $uibModal, $injector, $routeParams, $log, SubmissionModel, DataService, ModuleHelper,
             $anchorScroll, submissionDecorator) {

        //Copy data from model move to utility module
        submissionDecorator.create($scope);
        var MessageService =$injector.get('MessageService');
        $scope.SubmissionService = $injector.get('SubmissionService');
        $scope.mode=$rootScope.Constants.FormMode.ADD;

        $scope.hasError=false;
        $scope.title='Add a new submission';

        ModuleHelper.setData(SubmissionModel.createSubmission());
        $scope.submission=ModuleHelper.model.submission;
        $scope.viewSubmission=ModuleHelper.model.viewSubmission;
        $scope.submModel=ModuleHelper.model;



        var saveInterv=$interval(function() {
            //console.log('Save');
            console.log('interval created');
            $scope.save();
        }, 10000);

        $scope.$on("$destroy", function(){
            $interval.cancel(saveInterv);
            console.log('Swich data', saveInterv);

        });

        $scope.addAnnotation = function(parent) {
            SubmissionModel.addItemToArray(parent.attributes, SubmissionModel.createAttribute);
            $log.debug('Add an annotation from controller', parent.attributes.writable);

        };
        var container = angular.element(document.getElementById('container'));




        $scope.showError = function() {
            console.log('Error show or not');
            return true;
        }

        var timeout;
        var saveInProgress=false;


        $scope.save = function() {
            //generate id
            if ($scope.submission.id) {
                $interval.cancel(saveInterv);
                //remove autosave
            } else {
                DataService.saveUserData($scope.submission).then(function success(data) {
                    console.log('data saved',data);
                    $scope.submission.accno = data.accno;
                });
            }
        };

        $scope.submit = function(submissionForm) {
            //
            $log.debug('Submission',$scope.submission);
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.submissionForm.$invalid) {
                $log.debug('Validation error');
                return;
            }
            $log.debug('Submit data', $scope.submission);
            DataService.submit($scope.submission).then(function(data) {
                $log.debug('Submission created', data.mapping, typeof data);

                var acc = data.mapping[0].assigned;
                //var acc = '';

                MessageService.addMessage('Submission ' + acc + ' created');
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
                    $log.debug('Created acc', acc);
                    $location.url('/edit/' + acc);
                },function() {
                    $log.debug('Created acc 1');
                    $location.url('/edit/' + acc);
                });

            }).catch(function(err, status) {
                $log.debug('Created error', err, status);

                MessageService.addMessage('Server error '+ (status || ''));
                var modalInstance = $uibModal.open({
                    controller : 'MessagesCtrl',
                    templateUrl: 'templates/partials/errorDialog.html',
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

        $scope.selectTab = function(link) {
            console.log('Select tab');
        };

        $scope.addAnnotationToLink = function() {
            console.log('Add annotation to link');
        };


        $scope.deleteFile = function(index, parent) {
            var parentSection=$scope.getParentSection(parent);
            parentSection.files.splice(index, 1);
        };



        $scope.sourcesKeys=DataService.getSources();


        var addEdit=false;
        var editAnnotation='';



        $scope.refreshKeys = function(search) {
            if (search!=='' ) {
                editAnnotation.name=search;
                if ( !addEdit) {
                    $scope.annotationKeys.push(editAnnotation);
                    addEdit = true;
                }
            }
            angular.forEach($scope.annotationKeys, function(value,key) {
                /*if (key==='key') {

                }*/
            });
        };

    };
