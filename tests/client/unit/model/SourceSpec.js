'use strict';

require('./moduleHelper');

var fileArray=[
    {identifier:'name1', source: 'desc1'},
    {identifier:'name2', source: 'desc2'},

];


describe('Test model Source', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of Source', angular.mock.inject( function (Source) {
        var source = new Source('E-MEXP-1','ArrayExpress');
        expect(source).toBeDefined();
        expect(source.identifier).toEqual('E-MEXP-1');
        expect(source.source).toEqual('ArrayExpress');

    }));

    it('should create an instance of Source using build',
        angular.mock.inject( function (Source) {
            var source = Source.build('E-MEXP-1','ArrayExpress');
            expect(source).toBeDefined();
            expect(source.identifier).toEqual('E-MEXP-1');
            expect(source.source).toEqual('ArrayExpress');

        }));

    it('should create an array of Sources using buildArray',
        angular.mock.inject( function (Source) {
            var sources = Source.buildArray(fileArray);
            expect(sources).toBeDefined();
            expect(sources.length).toEqual(2);
            expect(sources[0]).toEqual(jasmine.any(Source));
            expect(sources[1]).toEqual(jasmine.any(Source));

        }));


});
