var _ =require('lodash');
var SubmissionModel = require('../../../shared/model/SubmissionModel');
var moduleHelper2 = require('./moduleHelper2');


describe('Test module helper2', function () {
    var submModel;

    beforeAll(function () {
    });
    it('create model', function () {
        submModel = SubmissionModel.createSubmission();
        var model = moduleHelper2.createSubmModel(submModel, 1);
    });

    describe('Test Element', function () {
        var link1;
        beforeEach(function() {
            link1=SubmissionModel.createLink();
            SubmissionModel.addAttribute.call(link1, {name: 'a'});
            SubmissionModel.addAttribute.call(link1);
            SubmissionModel.addAttribute.call(link1, {name: 'b'});

        });

        it('should create an element', function () {
            var element = moduleHelper2.createElement({model: link1});
            expect(element).toBeDefined();
            expect(element.model).toEqual(link1);
            expect(element.attributes).toBeDefined();
            expect(element.attributes.b).toBeDefined();
            expect(element.attributes['']).toBeDefined();
            expect(element.attributes.b).toBeDefined();
            expect(element.attributes.a).toEqual(link1.attributes[1]);


        });
        it('should add attr to the element', function () {
            var element = moduleHelper2.createElement({model: link1});
            var attr=SubmissionModel.createAttribute({name: 'c'});
            element.addAttribute(attr);
            expect(element.attributes.c).toBeDefined();
            expect(element.attributes.c).toEqual(attr);

        });



    });

    describe('Test attributeKeys', function () {
        var model;
        beforeEach(function() {
            model = moduleHelper2.createAttributeKeys();
            model.add('name1');
            model.add('name2');
            model.add('name2');
            model.add('name3');
            model.add('name3');
            model.add('name3');

        });

        it('should add a property and increase count', function () {
            expect(model.keys.name1).toEqual({count: 1, value: 'name1'});
            expect(model.keys.name2).toEqual({count: 2, value: 'name2'});
            expect(model.keys.name3).toEqual({count: 3, value: 'name3'});


        });

        it('should remove a property ', function () {
            model.remove('name1');
            model.remove('name2');
            model.remove('name3');
            expect(model.keys.name1).not.toBeDefined();
            expect(model.keys.name2).toEqual({count: 1, value: 'name2'});
            expect(model.keys.name3).toEqual({count: 2, value: 'name3'});

        });

        it('should remove a property which is undefined', function () {
            var n = '';
            model.add('');
            model.add('');
            expect(model.keys['']).toBeDefined();
            model.remove('');
            model.remove('');
            expect(model.keys['']).not.toBeDefined();
            console.log(model.keys);

            //expect(model.keys.name2).toEqual({count: 1, value: 'name2'});
            //expect(model.keys.name3).toEqual({count: 2, value: 'name3'});

        });
    });

    describe('Test module item', function () {
        var options = {fieldsCount:1, addItem: SubmissionModel.addLink};

        beforeEach(function() {
            submModel = SubmissionModel.createSubmission();
            SubmissionModel.addAttribute.call(submModel, SubmissionModel.createAttribute({"name":"name1"}))

        });

        it('should create a new item from modelk', function () {
            var link1=SubmissionModel.createLink();
            SubmissionModel.addLink.call(submModel.section, link1);
            options.model = submModel.section.links;
            var modelItem=moduleHelper2.createModuleItem(options);
            modelItem.create();
            expect(modelItem.attributeKeys.length).toEqual(1);
            expect(modelItem.model.length).toEqual(1);
            //console.log('eee', modelItem.attributeKeys);
            //expect(modelItem.attributeKeys.keys.Description).toBeDefined();

        })

    });

    describe('Test submModel ', function () {
        var link1, link2, submModel, file1, file2, contact1, publ1;
        beforeEach(function() {
            submModel = SubmissionModel.createSubmission();
            SubmissionModel.addAttribute.call(submModel, SubmissionModel.createAttribute({"name":"name1"}))
            link1=SubmissionModel.createLink();
            link2=SubmissionModel.createLink();
            SubmissionModel.addLink.call(submModel.section, link1);
            SubmissionModel.addLink.call(submModel.section, link2);
            SubmissionModel.addAttribute.call(link1);
            SubmissionModel.addAttribute.call(link2);
            SubmissionModel.addAttribute.call(link2, {name: 'LinkA1'});
            file1=SubmissionModel.createFile();
            file2=SubmissionModel.createFile();
            SubmissionModel.addFile.call(submModel.section, file1);
            SubmissionModel.addFile.call(submModel.section, file2);
            contact1=SubmissionModel.createContact();
            SubmissionModel.addContact.call(submModel.section, contact1);
            publ1=SubmissionModel.createPublication();
            SubmissionModel.addPublication.call(submModel.section, publ1);


        });

        xit('should create a subm', function () {
            var model = moduleHelper2.createSubmModel(submModel);
            expect(model.section.links).toBeDefined();
            expect(model.section.files).toBeDefined();

        })

        xit('add a new link', function () {
            var model = moduleHelper2.createSubmModel(submModel);
            model.section.links.add();

            expect(model.section.links.model.length).toEqual(3);
            expect(model.section.links.attributeKeys.length).toEqual(3);
            //expect(model.links.attributesKey).toEqual(['Description','','LinkA1']);
        })

        it('modify attributes in link ', function () {
            var model = moduleHelper2.createSubmModel(submModel);
            var attr=model.section.links.createAttr(link1);
            var n='';
            expect(model.section.links.attributeKeys.keys[n].count).toEqual(3);

            attr.name = 'A';
            model.section.links.changeAttr(attr.name, '');
            expect(model.section.links.attributeKeys.keys[n].count).toEqual(2);


            attr.name = 'AA';
            model.section.links.changeAttr(attr.name, 'A');


        })



    });

});