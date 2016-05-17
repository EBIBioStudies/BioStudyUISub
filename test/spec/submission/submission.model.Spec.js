'use strict';

var submExample = require("./submission.example.json");

describe("SubmissionModel", function () {

    var SubmissionModel;

    beforeEach(angular.mock.module('BioStudyApp'));

    beforeEach(inject(function ($injector) {
        SubmissionModel =  $injector.get('SubmissionModel');
    }));

    it('imports an empty object', function () {
        var subm = SubmissionModel.import({});
        expect(subm.accno).toEqual("");
        expect(subm.title).toEqual("");
        expect(subm.description).toEqual("");
        expect(subm.releaseDate).toBeNull();
        expect(subm.annotations.attributes).toEqual([]);
        expect(subm.files.items).toEqual([]);
        expect(subm.links.items).toEqual([]);
        expect(subm.contacts.items).toEqual([]);
        expect(subm.publications.items).toEqual([]);
    });

    it('imports non empty object', function() {
        var subm = SubmissionModel.import(submExample);
        expect(subm.accno).toEqual("S-STA01");
        expect(subm.title).toEqual("Example Submission");
        expect(subm.description).toEqual("Study Description");
        expect(subm.releaseDate).toEqual(new Date(2016, 11, 31));

        var anns = subm.annotations.attributes;
        expect(anns.length).toEqual(1);
        expect(anns[0].name).toEqual("Ref");
        expect(anns[0].value).toEqual("123456");

        var files = subm.files.items;
        expect(files.length).toEqual(1);
        expect(files[0].path).toEqual("/file");
        var fattrs = files[0].attributes.attributes;
        expect(fattrs.length).toEqual(1);
        expect(fattrs[0].name).toEqual("Description");
        expect(fattrs[0].value).toEqual("File Description");

        var links = subm.links.items;
        expect(links.length).toEqual(1);
        expect(links[0].url).toEqual("http://example.com");
        expect(links[0].attributes.attributes.length).toEqual(1); // 'Description' added automatically as it's required
        var lattrs = links[0].attributes.attributes;
        expect(lattrs.length).toEqual(1);
        expect(lattrs[0].name).toEqual("Description");
        expect(lattrs[0].value).toEqual("");



    });
});