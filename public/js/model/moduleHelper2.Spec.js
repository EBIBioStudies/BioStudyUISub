var _ =require('lodash');
var SubmissionModel = require('../../../shared/model/SubmissionModel');

function decorateSubmModel() {

}

var Submission =
describe('Test module helper2 model', function () {
    var submModel;

    beforeEach(function() {
        submModel = SubmissionModel.createSubmission();
        SubmissionModel.addAttribute.call(submModel, SubmissionModel.createAttribute({}))
    });

    beforeAll(function () {
    });

    it('Should add 2 attributes to study ', function () {
        console.log(submModel);
    })

});