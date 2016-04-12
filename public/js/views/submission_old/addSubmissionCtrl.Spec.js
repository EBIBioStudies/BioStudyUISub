'use strict';



describe('Controller addSubmissionCtrl',function() {

    beforeEach(angular.mock.module('BioStudyApp'));
    describe('',function() {
        var $rootScope, httpBackend, log,  $controller, _SubmissionModel,
            _DataService, _mock, sub;
        beforeEach(angular.mock.inject(function($httpBackend, $log, _$controller_, _$rootScope_ , SubmissionModel, DataService) {
            log = $log;
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            _SubmissionModel = SubmissionModel;
            _DataService = DataService;

            _mock = {
                $scope : $rootScope.$new(),
                SubmissionModel: _SubmissionModel,
                DataService : _DataService

            };

            sub = {
                attributes : []};

            spyOn(_mock.SubmissionModel, 'createSubmission').and.returnValue(sub);


        }));

        it('Should create controller', function(done) {

            var controller = $controller('AddSubmissionCtrl', _mock);
            console.log(_mock.$scope.submission);

            expect(controller).toBeDefined();
            expect(_mock.SubmissionModel.createSubmission).toHaveBeenCalled();

            expect(_mock.$scope.submission).toEqual(sub);

            done();
        });

        it('Should addAnnotation', function(done) {
            spyOn(_mock.SubmissionModel, 'addItemToArray');
            //spyOn(mockA.SubmissionModel, "createAttribute").and.returnValue({name:'a'});

            var controller = $controller('AddSubmissionCtrl', _mock);
            _mock.$scope.addAnnotation(sub);

            expect(_mock.SubmissionModel.addItemToArray).toHaveBeenCalled();

            done();
        });


    });

});