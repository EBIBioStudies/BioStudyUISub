'use strict';

require('./moduleHelper');
var authorsArray=[
    {name: 'name1',affiliation:'aff1'},
    {name: 'name2',affiliation:'aff2'}

];

describe('Test model Author', function() {

    beforeEach(function () {

        angular.mock.module('app');
    });
    it('should create an instance of Author', angular.mock.inject( function (Author) {
        var author = new Author('name1','description1');
        expect(author).toBeDefined();
        expect(author.name).toEqual('name1');
        expect(author.affiliation).toEqual('description1');

    }));

    it('should create an instance of Author using build',
        angular.mock.inject( function (Author) {
        var author = Author.build('name1','description1');
        expect(author).toBeDefined();
        expect(author.name).toEqual('name1');
        expect(author.affiliation).toEqual('description1');

    }));

    it('should create an array of Authors using buildArray',
        angular.mock.inject( function (Author) {
            var authors = Author.buildArray(authorsArray);
            expect(authors).toBeDefined();
            expect(authors.length).toEqual(2);
            expect(authors[0]).toEqual(jasmine.any(Author));
            expect(authors[1]).toEqual(jasmine.any(Author));

        }));


});
