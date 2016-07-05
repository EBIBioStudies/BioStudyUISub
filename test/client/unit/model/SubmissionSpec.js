'use strict';


require('./moduleHelper');
var data='[' +
    '{"id":1, "title":"The title.", "description":"desc1", "releaseDate":"2014-12-22T23:23:24.983Z","_id":"2IT6sGimmO1oaWHl"},' +
    '{"annotations": [{"key":"key1","value":"value1"}],' +
    '"files":[{"name":"key1","description":"value1"}],' +
    '"links":[{"url":"key1","description":"value1"}],' +
    '"authors":[{"name":"key1","affiliation":"value1"}],' +
    '"sources":[{"identifier":"key1","source":"value1"}],' +
    '"sections":[' +
        '{"name":"key1","description":"value1","sections": "[]"}],' +
    '"releaseDate":"2014-12-22T23:40:05.732Z","title":"Title","description":"dfdadas","id":3,"_id":"40mTLkS2wo8b4nVd"}' +

    ']';

describe('Test model Submission', function() {
    beforeEach(function () {
        angular.mock.module('app');
    });

    it('should create an instance of Submission', angular.mock.inject( function (Submission) {
        var sub = new Submission();
        expect(sub).toBeDefined();
        expect(sub.title).toEqual('');
        expect(sub.description).toEqual('');

    }));

    it('should create an instance of Submission from arguments', angular.mock.inject( function (Submission) {
        var submission={title:'Title'};
        var sub = new Submission(submission);
        expect(sub).toBeDefined();
        expect(sub.title).toEqual('Title');
    }));

    it('add Annotation to submission', angular.mock.inject( function (Submission, Annotation) {
        var sub = new Submission();
        expect(sub).toBeDefined();
        var ann = Annotation.build('key1','value1');
        sub.addAnnotation(ann);
        expect(sub.annotations).toBeDefined();
        expect(sub.annotations).toEqual(jasmine.any(Array));
        expect(sub.annotations.length).toEqual(1);
        expect(sub.annotations[0]).toBe(ann);

    }));


    it('add Link to submission', angular.mock.inject( function (Submission, Link) {
        var sub = new Submission();
        expect(sub).toBeDefined();
        var link = Link.build('name1','description1');
        sub.addLink(link);
        expect(sub.links).toBeDefined();
        expect(sub.links).toEqual(jasmine.any(Array));
        expect(sub.links.length).toEqual(1);
        expect(sub.links[0]).toBe(link);

    }));

    it('build the array of submission', angular.mock.inject( function (Submission, Annotation, Source,
    Link, Author, Section, File) {
        var dataSub=JSON.parse(data);
        var submissions=Submission.buildArray(dataSub);
        expect(submissions).toBeDefined();
        expect(submissions.length).toEqual(2);
        expect(submissions[0]).toEqual(jasmine.any(Submission));
        expect(submissions[0].id).toEqual(1);
        expect(submissions[0].title).toEqual('The title.');
        expect(submissions[0].description).toEqual('desc1');
        expect(submissions[0].releaseDate).toEqual(new Date('2014-12-22T23:23:24.983Z'));

        expect(submissions[1]).toEqual(jasmine.any(Submission));
        expect(submissions[1].annotations).toBeDefined();
        expect(submissions[1].annotations.length).toEqual(1);
        expect(submissions[1].annotations[0]).toEqual(jasmine.any(Annotation));
        expect(submissions[1].sources).toBeDefined();
        expect(submissions[1].sources.length).toEqual(1);
        expect(submissions[1].sources[0]).toEqual(jasmine.any(Source));
        expect(submissions[1].links).toBeDefined();
        expect(submissions[1].links.length).toEqual(1);
        expect(submissions[1].links[0]).toEqual(jasmine.any(Link));

        expect(submissions[1].authors).toBeDefined();
        expect(submissions[1].authors.length).toEqual(1);
        expect(submissions[1].authors[0]).toEqual(jasmine.any(Author));

        expect(submissions[1].sections).toBeDefined();
        expect(submissions[1].sections.length).toEqual(1);
        expect(submissions[1].sections[0]).toEqual(jasmine.any(Section));

        expect(submissions[1].files).toBeDefined();
        expect(submissions[1].files.length).toEqual(1);
        expect(submissions[1].files[0]).toEqual(jasmine.any(File));



    }));

});
