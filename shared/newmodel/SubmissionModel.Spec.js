'use strict';
var SubmissionModel = require('./SubmissionModel');
var ModelRes = require('./ModelRes.json');
var _ = require('lodash');


describe('Test Submission model', function() {
    beforeEach(function () {
    });

    describe('Test submission', function() {

        it('should create a submission object', function () {
            var sub = SubmissionModel.createSubmission({});
            expect(sub).toBeDefined();
            expect(sub.type).toEqual(ModelRes.type);
            expect(sub.accno).toEqual(ModelRes.accno);
            expect(sub.accessTags).toEqual(ModelRes.accessTags);
            expect(sub.attributes).toEqual(jasmine.arrayContaining([]));
            expect(sub.section).toEqual(SubmissionModel.createSection({}));

        });

        it('should create a submission and modify a title', function () {
            var sub = SubmissionModel.createSubmission({});
            expect(sub).toBeDefined();
        });
    });

    describe('Test attributes', function(){
        it('should create a default attribute', function() {
            var attr = SubmissionModel.createAttribute({});
            expect(attr).toBeDefined();
            expect(attr.name).toEqual('');
            expect(attr.value).toEqual('');
        });

        it('should create an attribute with name and value', function() {
            var attr = SubmissionModel.createAttribute({name: 'name1', value: 'value1'});
            expect(attr).toBeDefined();
            expect(attr.name).toEqual('name1');
            expect(attr.value).toEqual('value1');
        });

        it('should add attribute to the subsection - contacts', function() {
            var subm=SubmissionModel.createSubmission();

            SubmissionModel.addContact.call(subm.section);
            SubmissionModel.addContact.call(subm.section);
            SubmissionModel.addContact.call(subm.section);

            SubmissionModel.addPublication.call(subm.section);
            expect(subm.section.subsections.length).toEqual(4);

            SubmissionModel.addAttributeTo(subm.section.subsections, SubmissionModel.createAttribute({name: 'Shared'}), 'Contacts');
            SubmissionModel.addAttributeTo(subm.section.subsections, SubmissionModel.createAttribute({name: 'Shared'}), 'Contacts');

            var contacts=_.filter(subm.section.subsections, ['type', 'Contact']);
            var pubs=_.filter(subm.section.subsections, ['type', 'Publication']);

            expect(contacts.length).toEqual(3);
            expect(pubs.length).toEqual(1);
            expect(contacts[0].attributes.length).toEqual(3);
            expect(contacts[1].attributes.length).toEqual(3);
            expect(contacts[2].attributes.length).toEqual(3);
            SubmissionModel.addAttributeTo(subm.section.subsections, SubmissionModel.createAttribute({name: 'Shared'}), 'contact');
            expect(contacts[0].attributes.length).toEqual(3);
            expect(contacts[1].attributes.length).toEqual(3);
            expect(contacts[2].attributes.length).toEqual(3);

            expect(pubs[0].attributes.length).toEqual(1);


            expect(subm.section.subsections.length).toEqual(4);
        });

    });
    describe('Test files', function() {

        it('should create a file ', function () {
            var attr = SubmissionModel.createFile({attributes: [{name: 'name1', value: 'value1'}]});
            expect(attr).toBeDefined();
            expect(attr.path).toEqual('');
            expect(attr.attributes[0].name).toEqual('name1');
        });
    });

    describe('Test link', function() {

        it('should create a link', function () {
            var link = SubmissionModel.createLink({});
            expect(link).toBeDefined();
            expect(link.url).toEqual('');
            expect(link.addAttribute).toBeDefined();
        });
        it('should add attribute to link', function() {

            var link =  SubmissionModel.createLink({});
            link.addAttribute(SubmissionModel.createAttribute({name : 'name', value: 'value'}));
            expect(link.attributes[0]).toEqual({name : 'name', value: 'value'});
        });

        it('should add a new link and param is undefined', function() {

            var sub = {
                sections : {

                }
            }
            var link =  SubmissionModel.addLink.call(sub.sections);
            expect(sub.sections.links).toBeDefined();
            expect(sub.sections.links[0]).toBeDefined();
        });

        it('should add a new link and param is a new link', function() {

            var sub = {
                sections : {

                }
            }
            var link =  SubmissionModel.addLink.call(sub.sections, SubmissionModel.createLink());
            expect(sub.sections.links).toBeDefined();
            expect(sub.sections.links[0]).toBeDefined();;
        });

    });
    describe('Test subsection', function() {

    });

    describe('Test contact', function() {
        it('should create a new contact', function() {
            var contact =  SubmissionModel.createContact();
            expect(contact).toBeDefined();
            expect(contact.attributes).toBeDefined();
            expect(contact.type).toEqual('Contact');
            expect(contact.attributes).toEqual([ Object({ name: 'Name', value: '' }), Object({ name: 'Organization', value: '' }), Object({ name: 'E-mail', value: '' }) ]);

        });

        it('should create and add Contact to submission', function() {

            var sub = {
                section: {}
            };
            var contact =  SubmissionModel.addContact.call(sub);
            expect(sub.subsections).toBeDefined();
            expect(sub.subsections).toEqual([{type: 'Contact',attributes:[
                { name: 'Name', value: '' },
                { name: 'Organization', value: '' },
                { name: 'E-mail', value: '' }
            ]}]);

        });

    });


        describe('Test publication', function() {
        it('should create a new publication', function() {
            var pub =  SubmissionModel.createPublication();
            expect(pub).toBeDefined();
            expect(pub.attributes).toBeDefined();
            expect(pub.type).toEqual('Publication');
        });
        it('should create and add Publication to subsection', function() {

            var sub = {
                section: {}
            };
            var pub =  SubmissionModel.addPublication.call(sub.section);
            expect(sub.section.subsections).toBeDefined();
            expect(sub.section.subsections).toEqual([{type: 'Publication',attributes:[
                {name: 'Pub. Med. Id', value: ''}]}]);

        });

    });

        it('should add item to array', function() {
            var array = [];
            SubmissionModel.addItemToArray(array, SubmissionModel.createAttribute);
            expect(array).toEqual(jasmine.arrayContaining([SubmissionModel.createAttribute()]));
    });

});


function verifyAttributes(attrs, name, value) {
    var i;
    for (i=0;i<attrs.length;i++) {
        if (attrs[i].name==name) {
            if (attrs[i].value === value) {
                return true;
            }
            return false;

        }
    }
    return false;

}