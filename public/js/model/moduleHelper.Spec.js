var moduleHelper = new (require('./modelHelper'))(require('../.././SubmissionModel'));
var submission = require('../../../server/models/submission.json');

describe('Test module helper model', function() {
    beforeAll(function () {
    });

    it('should create a new model and viewModel', function() {
        var data = {};
        moduleHelper.setData({});

        expect(moduleHelper.model).toBeDefined();
        expect(moduleHelper.model.submission).toBeDefined();
        expect(moduleHelper.model.viewSubmission).toBeDefined();
    })
    it('should add a file to the new model', function() {
        var data = {};
        moduleHelper.setData({});

        expect(moduleHelper.model.viewSubmission.section.files).toBeDefined();
        moduleHelper.model.viewSubmission.section.files.add();

        expect(moduleHelper.model.viewSubmission.section.files.model.length).toEqual(1);
        //expect(moduleHelper.model.viewSubmission.section.files.r).toEqual(1);
        expect(moduleHelper.model.viewSubmission.section.files.ref.length).toEqual(1);


    })

    it('should create model from existing data and check col_size', function() {

        var data = {
            attributes: [
                {name: 'Title', value: 'TitleValue'}
            ],
            section:{
                type: 'Study',
                attributes: []
            }
        };
        moduleHelper.setData(data);
        moduleHelper.model.viewSubmission.section.links.add();
        console.log(moduleHelper.model.viewSubmission.section.links);

    })

});