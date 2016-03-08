'use strict';

require('./moduleHelper');

var linkArray=[
    {url:'name1', description: 'desc1'},
    {url:'name2', description: 'desc2'},

];


describe('Test model Link', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of Link', angular.mock.inject( function (Link) {
        var link = new Link('name1','description1');
        expect(link).toBeDefined();
        expect(link.url).toEqual('name1');
        expect(link.description).toEqual('description1');

    }));

    it('should create an instance of Link using build',
        angular.mock.inject( function (Link) {
            var link = Link.build('name1','description1');
            expect(link).toBeDefined();
            expect(link.url).toEqual('name1');
            expect(link.description).toEqual('description1');

        }));

    it('should create an array of Links using buildArray',
        angular.mock.inject( function (Link) {
            var links = Link.buildArray(linkArray);
            expect(links).toBeDefined();
            expect(links.length).toEqual(2);
            expect(links[0]).toEqual(jasmine.any(Link));
            expect(links[1]).toEqual(jasmine.any(Link));

        }));


});
