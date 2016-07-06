'use strict';

var fs = require('fs');
var config = require('../../../.gen/config.json');
var helper=require('../unit/angularHelper');

describe('Test mock service', function() {

    var $compile, $rootScope;
    beforeEach(function(){
        angular.mock.module('app',function($provide) {
            $provide.provider('AuthService',function() {
                this.$get = function() {
                    return helper.getAuthServiceMock();
                };
            });
        });
    });

    beforeEach(angular.mock.inject(function($injector) {
        helper.init($injector);
        $compile=$injector.get('$compile');
        $rootScope = helper.$rootScope;
        console.log($injector.get('AuthService'));

    }));

    it('should not show when you are not signed in and access level is admin', function () {

    });


});