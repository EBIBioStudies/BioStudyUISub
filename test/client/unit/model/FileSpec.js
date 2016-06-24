'use strict';

require('./moduleHelper');

var fileArray=[
    {name:'name1', description: 'desc1'},
    {name:'name2', description: 'desc2'},

];

describe('Test model Annotation', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of File', angular.mock.inject( function (File) {
        var file = new File('name1','description1');
        expect(file).toBeDefined();
        expect(file.name).toEqual('name1');
        expect(file.description).toEqual('description1');

    }));

    it('should create an instance of File using build', angular.mock.inject( function (File) {
        var file = File.build('name1','description1');
        expect(file).toBeDefined();
        expect(file.name).toEqual('name1');
        expect(file.description).toEqual('description1');

    }));

    it('should create an array of Files using buildArray',
        angular.mock.inject( function (File) {
            var files = File.buildArray(fileArray);
            expect(files).toBeDefined();
            expect(files.length).toEqual(2);
            expect(files[0]).toEqual(jasmine.any(File));
            expect(files[1]).toEqual(jasmine.any(File));

        }));



});
