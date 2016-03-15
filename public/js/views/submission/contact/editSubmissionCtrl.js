/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var _keys = require('./../../../../shared/model/Structure.json');

module.exports =
    function($rootScope, $scope, $http, $timeout, $interval, $location,
             $uibModal, $injector, $routeParams, $log,$anchorScroll, SharedData, ModuleHelper) {


        //Copy data from model
        function model2View(submission, viewSubmission) {

            angular.forEach(submission.attributes, function(el, index) {
                if (el.name==='Title') {
                    viewSubmission.title = el.value;
                } else if (el.name === 'ReleaseDate') {
                    viewSubmission.rdate = new Date(el.value);
                }
            });

        }

        function view2Model(viewSubmission, submission) {
            //reference to title
            submission.attributes[0].value = viewSubmission.title;
            //reference to release date
            submission.attributes[1].value = viewSubmission.rdate;

        }

        var DataService =$injector.get('DataService'),
            MessageService =$injector.get('MessageService'),
            SubmissionModel = $injector.get('SubmissionModel');

        $scope.mode=$rootScope.Constants.FormMode.ADD;

        $scope.mode=$rootScope.Constants.FormMode.EDIT;
        $scope.title='Edit the submission ' + $routeParams.accno;
        $scope.format = 'dd/MM/yyyy';
        $scope.dateOptions= {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.keys = _keys;
        $scope.annotationKeys = _keys.annotation;

        $scope.viewSubmission={contacts: {}};
        $scope.submModel = {};

        var saveInterv;
        $scope.$on("$destroy", function(){
            $interval.cancel(saveInterv);
        });


        if ($routeParams.accno) {
            $log.debug('Edit the submission ', $routeParams);
            DataService.getSubmission($routeParams.accno).then(function(data) {
                console.log(ModuleHelper);
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
            });

        } else {
           $location.url('/submissions');
        }


        $scope.hasError=false;

        var timeout;
        var saveInProgress=false;

        //$scope.$watch('submission', watchSubmission, true);

        $scope.save = function() {
            //generate id
            if ($scope.submission.id) {
                $interval.cancel(saveInterv);
                //remove autosave
            } else {
                view2Model($scope.viewSubmission, $scope.submission);
                console.log('data saved',$scope.submModel.submission);

                DataService.saveUserData($scope.submModel.submission).then(function success(data) {
                    console.log('data saved',data);
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
            view2Model($scope.viewSubmission, $scope.submission);
            $log.debug('Submit data', $scope.submModel.submission);
            DataService.update($scope.submModel.submission).then(function(data) {
                var acc = $scope.submModel.submission.accno;
                MessageService.addMessage('Submission ' + acc + ' updated.');
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
        };

        $scope.addAttributeTo = function(parent) {
            var attr= SubmissionModel.createAttribute();
            $scope.viewSubmission.contacts.attributesKey(attr);
            SubmissionModel.addAttributeTo(parent, SubmissionModel.createAttribute(), 'conract');

        };


        $scope.addLink = function(parent) {
            var link=SubmissionModel.addLink.call(parent);
            $log.debug('Add an link from controller', parent, link);
        };

        function scrollTo(hash) {
            $timeout(function() {
                $location.hash(hash);
                $anchorScroll();

            });
        }
        $scope.addContact = function(parent) {
            //create subsections and add conract
            var contact=SubmissionModel.addContact.call(parent);
            /*for (var i in $scope.viewSubmission.conracts) {
                var attr=SubmissionModel.createAttribute({name: $scope.viewSubmission.conracts[i]});
                contact.attributes.push(attr);
            }*/

        };

        $scope.addPublication = function(parent) {
            //create subsections and add conract
            SubmissionModel.addPublication.call(parent);
            $log.debug('Add an publication', parent);

        };

        $scope.addOrganization = function(parent) {
            //create subsections and add conract
            SubmissionModel.addOrganization.call(parent);
            $log.debug('Add an organization', parent);

        };

        $scope.addFile = function(parent) {
            $log.debug('Add an file');

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/partials/filesTree.html',
                controller: 'FilesTreeCtrl',
                backdrop: true,
                keyboard: true
            });

            modalInstance.result.then(function(fileParam) {
                if (fileParam && fileParam.path) {
                    SubmissionModel.addFile.call(parent, {path: fileParam.path});
                    $log.debug('Add an file', fileParam, parent);
                }
            });
            //create subsections and add conract
        };




        $scope.showFileDlg = function(parent) {
            console.log('Show file dialog',parent);
            $scope.curentSectionForFiles=$scope.getParentSection(parent);

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/partials/filesTree.html',
                controller: 'FilesTreeCtrl',
                backdrop: true,
                keyboard: true
            });

            modalInstance.result.then(function(fileParam) {
                if (fileParam && fileParam.name) {
                    var file = SubmissionModel.createFile({path: fileParam.name});
                    //$scope.curentSectionForFiles.addFile(file);
                }
            });
        };

        $scope.deleteFile = function(index, parent) {
            var parentSection=$scope.getParentSection(parent);
            parentSection.files.splice(index, 1);
        };



        $scope.sourcesKeys=DataService.getSources();

        $scope.annotationKeys = DataService.getAnnotationKeys();
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
