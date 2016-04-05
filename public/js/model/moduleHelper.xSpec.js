var moduleHelper = new (require('./modelHelper'))(require('../../../shared/model/SubmissionModel'));
var SubmissionModel = require('../../../shared/model/SubmissionModel');
var submission = require('../../../server/models/submission.json');

describe('Test module helper model', function () {
    beforeAll(function () {
    });

    it('should create a new model and viewModel', function () {
        var data = {};
        moduleHelper.setData({});

        expect(moduleHelper.model).toBeDefined();
        expect(moduleHelper.model.submission).toBeDefined();
        expect(moduleHelper.model.viewSubmission).toBeDefined();
    })
    it('should add a file to the new model', function () {
        var data = {};
        moduleHelper.setData({});

        expect(moduleHelper.model.viewSubmission.section.files).toBeDefined();
        moduleHelper.model.viewSubmission.section.files.add();

        expect(moduleHelper.model.viewSubmission.section.files.model.length).toEqual(1);
        //expect(moduleHelper.model.viewSubmission.section.files.r).toEqual(1);
        expect(moduleHelper.model.viewSubmission.section.files.ref.length).toEqual(1);

    });

    it('should create model from existing data and check col_size', function () {

        var data = {
            attributes: [
                {name: 'Title', value: 'TitleValue'}
            ],
            section: {
                type: 'Study',
                attributes: []
            }
        };
        moduleHelper.setData(data);
        moduleHelper.model.viewSubmission.section.links.add();

    }),
        describe('Test  section attributes', function () {
            var data;
            beforeEach(function () {
                 data = {
                    attributes: [],
                    section: {
                        type: 'Study',
                        attributes: [
                            {name: 'Description', value: 'TitleValue'},
                            {name: 'xxx', value: 'xxx'}

                        ]
                    }
                };

            });
            it('should create model', function () {

                moduleHelper.setData(data);
                expect(moduleHelper.model.viewSubmission.section.attributes.model.Description).toEqual(data.section.attributes[0]);
                //console.log(moduleHelper.model.viewSubmission);
                //moduleHelper.model.viewSubmission.section.attributes.addAttribute({name:'a1'});
                //console.log(moduleHelper.model.viewSubmission.section.attributes);
            })
            it('should add a new attribute', function () {

                moduleHelper.setData(data);
                moduleHelper.model.viewSubmission.section.attributes.add({name:'a1'});
                expect(moduleHelper.model.viewSubmission.section.attributes.model.a1).toEqual(data.section.attributes[3]);

                //console.log(moduleHelper.model.viewSubmission.section.attributes);
            }),
                it('should delete an existing attribute', function () {

                    moduleHelper.setData(data);
                    moduleHelper.model.viewSubmission.section.attributes.remove(data.section.attributes[1]);
                    //expect(moduleHelper.model.viewSubmission.section.attributes.length).toEqual(1);
                })

        })
    describe('Test links', function () {
        var data;
        beforeEach(function () {
            data = SubmissionModel.createSubmission({});
        });
        it('should add a new link', function () {

            moduleHelper.setData(data);
            moduleHelper.model.viewSubmission.section.links.add();
            //expect(moduleHelper.model.viewSubmission.section.attributes.a1).toEqual(data.section.attributes[2]);

            //console.log(moduleHelper.model.viewSubmission.section.attributes);
        })
        it('should add a new attributes', function () {

            moduleHelper.setData(data);
            moduleHelper.model.viewSubmission.section.links.add();
            moduleHelper.model.viewSubmission.section.links.model[0].createAttribute();
            moduleHelper.model.viewSubmission.section.links.model[0].createAttribute();
            moduleHelper.model.viewSubmission.section.links.model[0].createAttribute();

            //moduleHelper.model.viewSubmission.section.links.model[0].attributes[0];

            moduleHelper.model.viewSubmission.section.links.model[0].attributes.Key_2.name="Key_1";
            moduleHelper.model.viewSubmission.section.links.model[0].changeAttr(moduleHelper.model.viewSubmission.section.links.model[0].attributes.Key_2);
            console.log(moduleHelper.model.viewSubmission.section.links.model[0].attributes);
            console.log(moduleHelper.model.viewSubmission.section.links.attributesKey);

            //expect(moduleHelper.model.viewSubmission.section.attributes.a1).toEqual(data.section.attributes[2]);

            //console.log(moduleHelper.model.viewSubmission.section.attributes);
        })
    })


});