'use strict';
require('../../../envHelper');
require('../testHelper');

var assert = require('assert');

var db=require('../../../server/models/database');

describe('Test Database', function() {
    var submissions;
    describe('Should initialize the database ', function(){
        it('should return the db object', function(){
            assert.notEqual(db,undefined,'db is not defined');
            assert.notEqual(db,null,'db is null');
        });

    });
});