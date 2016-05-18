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
        var fileAttrs = files[0].attributes.attributes;
        expect(fileAttrs.length).toEqual(1);
        expect(fileAttrs[0].name).toEqual("Description");
        expect(fileAttrs[0].value).toEqual("File Description");

        var links = subm.links.items;
        expect(links.length).toEqual(1);
        expect(links[0].url).toEqual("http://example.com");
        var linkAttrs = links[0].attributes.attributes;
        expect(linkAttrs.length).toEqual(1); // 'Description' added automatically as it's required
        expect(linkAttrs[0].name).toEqual("Description");
        expect(linkAttrs[0].value).toEqual("");
        
        var publications = subm.publications.items;
        expect(publications.length).toEqual(1);
        var publAttrs = publications[0].attributes.attributes;
        expect(publAttrs.length).toEqual(5);
        expect(publAttrs[0].name).toEqual("Title");
        expect(publAttrs[0].value).toEqual("Publication Title");
        expect(publAttrs[1].name).toEqual("Journal");
        expect(publAttrs[1].value).toEqual("PLoS biology");
        expect(publAttrs[2].name).toEqual("Volume");
        expect(publAttrs[2].value).toEqual("3(1)");
        expect(publAttrs[3].name).toEqual("Pages");
        expect(publAttrs[3].value).toEqual("e15");
        expect(publAttrs[4].name).toEqual("Publication date");
        expect(publAttrs[4].value).toEqual("2005 Jan");

        var contacts = subm.contacts.items;
        expect(contacts.length).toEqual(1);
        var contactAttrs = contacts[0].attributes.attributes;
        expect(contactAttrs.length).toEqual(3); // 'Name', 'Organisation', 'E-mqil' added automatically as they're required
        expect(contactAttrs[0].name).toEqual("Name");
        expect(contactAttrs[0].value).toEqual("John Doe");
        expect(contactAttrs[1].name).toEqual("Organisation");
        expect(contactAttrs[1].value).toEqual("affilRef1");
        expect(contactAttrs[2].name).toEqual("E-mail");
        expect(contactAttrs[2].value).toEqual("");
    });
});