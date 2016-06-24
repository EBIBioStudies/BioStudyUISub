'use strict';

var submExample = require("./submission.example.json");

describe("SubmissionModel", function () {

    var SubmissionModel;

    beforeEach(angular.mock.module('BioStudyApp'));

    beforeEach(inject(function ($injector) {
        SubmissionModel = $injector.get('SubmissionModel');
    }));

    it('imports an empty object', function () {
        var subm = SubmissionModel.import({});
        expect(subm.accno).toEqual("");
        expect(subm.title).toEqual("");
        expect(subm.description).toEqual("");
        expect(subm.releaseDate).toBeNull();
        expect(subm.annotations.items[0].attributes.attributes).toEqual([]);
        expect(subm.files.items).toEqual([]);
        expect(subm.links.items).toEqual([]);
        expect(subm.contacts.items).toEqual([]);
        expect(subm.publications.items).toEqual([]);
    });

    it('imports non empty object', function () {
        var subm = SubmissionModel.import(submExample);
        expect(subm.accno).toEqual("S-STA01");
        expect(subm.title).toEqual("Example Submission");
        expect(subm.description).toEqual("Study Description");
        expect(subm.releaseDate).toEqual(new Date(2016, 11, 31));

        var anns = subm.annotations.items[0].attributes.attributes;
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
        expect(contactAttrs[1].value).toEqual("The Institute for Genomic Research, Rockville Maryland");
        expect(contactAttrs[2].name).toEqual("E-mail");
        expect(contactAttrs[2].value).toEqual("");
    });

    it('exports accno, title and releaseDate', function () {
        var subm = SubmissionModel.import({});
        subm.accno = "S-STA02";
        subm.title = "Title";
        subm.releaseDate = new Date(2016, 11, 31);

        var exported = SubmissionModel.export(subm);
        expect(exported.type).toEqual("Submission");
        expect(exported.attributes.length).toEqual(2);
        expect(exported.attributes[0].name).toEqual("Title");
        expect(exported.attributes[0].value).toEqual("Title");
        expect(exported.attributes[1].name).toEqual("ReleaseDate");
        expect(exported.attributes[1].value).toEqual("2016-12-31");

        var imported = SubmissionModel.import(exported);
        expect(imported.accno).toEqual(subm.accno);
        expect(imported.title).toEqual(subm.title);
        expect(imported.releaseDate).toEqual(subm.releaseDate);
    });

    it('exports description and annotations', function () {
        var subm = SubmissionModel.import({});
        subm.description = "Description";
        subm.addAnnotation(
            {
                name: "Annot",
                value: "Value"
            }
        );

        var exported = SubmissionModel.export(subm);
        expect(exported.section).toBeDefined();
        expect(exported.section.type).toEqual("Study");
        var sectionAttrs = exported.section.attributes;
        expect(sectionAttrs.length).toEqual(2);
        expect(sectionAttrs[0].name).toEqual("Description");
        expect(sectionAttrs[0].value).toEqual("Description");
        expect(sectionAttrs[1].name).toEqual("Annot");
        expect(sectionAttrs[1].value).toEqual("Value");

        var imported = SubmissionModel.import(exported);
        expect(imported.description).toEqual(subm.description);
        expect(imported.annotations.items[0].attributes.attributes.length)
            .toEqual(subm.annotations.items[0].attributes.attributes.length);
    });

    it('exports files and links', function () {
        var subm = SubmissionModel.import({});
        subm.addFile("/file", [{name: "Description", value: "File description"}]);
        subm.addLink("http://example.com", [{name: "Description", value: "Url description"}]);

        var exported = SubmissionModel.export(subm);
        expect(exported.section.files).toBeDefined();
        var files = exported.section.files;
        expect(files.length).toEqual(1);
        expect(files[0].path).toEqual("/file");
        var fileAttrs = files[0].attributes;
        expect(fileAttrs.length).toEqual(1);
        expect(fileAttrs[0].name).toEqual("Description");
        expect(fileAttrs[0].value).toEqual("File description");


        expect(exported.section.links).toBeDefined();
        var links = exported.section.links;
        expect(links.length).toEqual(1);
        expect(links[0].url).toEqual("http://example.com");
        var linkAttrs = links[0].attributes;
        expect(linkAttrs.length).toEqual(1);
        expect(linkAttrs[0].name).toEqual("Description");
        expect(linkAttrs[0].value).toEqual("Url description");


        var imported = SubmissionModel.import(exported);
        expect(imported.files.items.length).toEqual(subm.files.items.length);
        expect(imported.links.items.length).toEqual(subm.links.items.length);
    });

    it('exports contacts', function () {
        var subm = SubmissionModel.import({});
        subm.addContact([
            {
                name: "Name",
                value: "Contact 1"
            },
            {
                name: "Organisation",
                value: "Org1"
            },
            {
                name: "E-mail",
                value: "c1@mail.org"
            }
        ]);

        var exported = SubmissionModel.export(subm);
        expect(exported.section.subsections).toBeDefined();
        var subsections = exported.section.subsections;
        expect(subsections.length).toEqual(2); // 1 contact + 1 organisation
        expect(subsections[0].type).toEqual("Author");
        var attrs = subsections[0].attributes;
        expect(attrs.length).toEqual(3);
        expect(attrs[0]).toEqual({name: "Name", value: "Contact 1"});
        expect(attrs[1]).toEqual({name: "Affiliation", value: "ref1", isReference: true});
        expect(attrs[2]).toEqual({name: "E-mail", value: "c1@mail.org"});

        expect(subsections[1].type).toEqual("Affiliation");
        expect(subsections[1].accno).toEqual("ref1");
        expect(subsections[1].attributes.length).toEqual(1);
        expect(subsections[1].attributes[0]).toEqual({name: "Name", value: "Org1"});
    });

    it('exports publications', function () {
        var subm = SubmissionModel.import({});
        subm.addPublication([
            {
                name: "Title",
                value: "A publication"
            }
        ]);
        
        var exported = SubmissionModel.export(subm);
        expect(exported.section.subsections).toBeDefined();
        var subsections = exported.section.subsections;
        expect(subsections.length).toEqual(1);
        expect(subsections[0].type).toEqual("Publication")
        expect(subsections[0].attributes.length).toEqual(1);
        expect(subsections[0].attributes[0]).toEqual({name: "Title", value: "A publication"});
    });

    it('exports empty submission', function () {
        var subm = SubmissionModel.import({});
        var exported = SubmissionModel.export(subm);
        var imported = SubmissionModel.import(exported);

        expect(imported.accno).toEqual(subm.accno);
        expect(imported.title).toEqual(subm.title);
        expect(imported.releaseDate).toEqual(subm.releaseDate);
    });

});