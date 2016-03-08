'use strict';
require('../../../envHelper');
require('../testHelper');

var Submissions=require('../../../server/models/Submissions');
var assert = require('assert');


describe('Submissions model', function() {
    var subRec = {acc: 'ACC_FOR_TEST'};
    var subm;

    beforeEach(function (done) {
        /*submissions.save(subRec, function (err, newRec) {
            subm=newRec;
            console.log('Save the submission', newRec);

            done(err);

        });*/
        done();
    });

    afterEach(function (done) {
        /*submissions.remove( subm, function (err) {
            console.log('Delete the submission');

            done(err);
        });*/
        done();
    });

    describe('get', function () {

        it('should return the submissions', function (done) {
            var submissions = new Submissions();

            submissions.get({}, function (err, result) {
                assert.notEqual(result, undefined);
                assert(result instanceof Array, true);
                done(err);
            });
        });


    });


});