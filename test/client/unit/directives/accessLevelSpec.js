'use strict';

var fs = require('fs');
var config = require('../../../../.gen/config.json');
var helper=require('../angularHelper');


describe('Test directive', function() {

    var $compile, $rootScope;
    beforeEach(function(){
        angular.mock.module('app');
    });

    beforeEach(angular.mock.inject(function($injector) {
        helper.init($injector);
        $compile=$injector.get('$compile');
        $rootScope = $injector.get('$rootScope');

    }));

    it('should not show when you are not signed in and access level is admin', function () {

        var element = $compile('<div access-level="admin"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.attr('style')).toBe('display: none;');
        console.log(element, element.attr('style'));
    });
    it('should not show when you are not signed in and access level is user', function () {

        var element = $compile('<div access-level="user"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.attr('style')).toBe('display: none;');
        console.log(element, element.attr('style'));
    });
    it('should show when you are not signed in and access level is public', function () {

        var element = $compile('<div access-level="public"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.attr('style')).toBe(undefined);
        console.log(element, element.attr('style'));
    });



});