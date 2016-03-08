'use strict';

var rc = require('../../../../public/js/routeConfig');

describe('Check value of routeConfig', function() {
    it('should have userRoles defined', function() {
        //rc.userRoles.public.should.be.defined();
        expect(rc.userRoles.public).toBeDefined();
        expect(rc.userRoles.user).toBeDefined();
        expect(rc.userRoles.admin).toBeDefined();
        //expect(rc.userRoles.publicOnly).toBeDefined();

    });

    it('should have accessLevels defined', function() {
        expect(rc.accessLevels.public).toBeDefined();
        expect(rc.accessLevels.user).toBeDefined();
        //expect(rc.accessLevels.publicOnly).toBeDefined();

    });



});