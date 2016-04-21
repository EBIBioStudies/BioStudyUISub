/*
'use strict';
var testData = {
    submission: {
        list: require('../../../tests/data/submission.list.json')
    }
};



describe('BioStudyApp test DataService',function() {

    beforeEach(angular.mock.module('BioStudyApp'));
    describe('Test DataService',function() {
        var scope, httpBackend, log, _DataService;
        beforeEach(angular.mock.inject(function($httpBackend, $log, DataService) {
            httpBackend = $httpBackend;
            log = $log;
            _DataService = DataService;
            httpBackend.when('GET', subroute.list.url).respond(200,testData.submission.list);
            httpBackend.when('POST', subroute.create.url).respond(200,{});

        }));

        it('Should create DataService', function(done) {
            expect(_DataService).toBeDefined();
            done();
        });

        it('Should return the submissions list', function(done) {
            expect(_DataService.getSubmissions).toBeDefined();
            _DataService.getSubmissions().then(function(data) {
                expect(data).toBeDefined();
                expect(data).toEqual(testData.submission.list.submissions);
                done();
            }).catch(function(error){
                fail('Should not return error');
                done();
            });
            httpBackend.flush();
        });

    });

});*/
