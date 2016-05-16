'use strict';

//var SubmissionModel = factory(require('../../../public/js/submission/model/submission.model'));

/*function factory(array) {
 if (array) {
 var constructor = array[array.length - 1];
 return constructor.call(...);
 }
 }*/

describe("SubmissionModel", function () {

    var SubmissionModel;

    beforeEach(angular.mock.module('BioStudyApp'));

    beforeEach(inject(function ($injector) {
        SubmissionModel =  $injector.get('SubmissionModel');
    }));

    it('imports an empty object', function () {
        var subm = SubmissionModel.import({});
        expect(subm.title).toEqual("");
    });

});