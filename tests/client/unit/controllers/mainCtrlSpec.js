'use strict';

var fs = require('fs');
var config = require('../../../../.gen/config.json');
var helper=require('../angularHelper');

var signInJsonSuccess = { 'status': 'OK', 'username': 'demo' };
var signInJsonError = { 'status': 'OK', 'username': 'demo' };


describe('Test MainCtrl', function() {
    var ctrl, signInHandleSuccess, signInHandleError;

    beforeEach(function(){
        angular.mock.module('app');
    });

    beforeEach(angular.mock.inject(function($injector) {
        helper.init($injector);
        var $controller = $injector.get('$controller');
        signInHandleSuccess = helper.$httpBackend.when(config.routing.signin.method, config.routing.signin.url)
            .respond(signInJsonSuccess);

        ctrl = $controller('MainCtrl', {
            $scope : helper.$rootScope
        });
    }));

    it('should call sign in', function() {
        expect(helper.$rootScope.signIn).toBeDefined();
        helper.$httpBackend.expectPOST(config.routing.signin.url);
        helper.$rootScope.signIn();
        console.log(helper.$rootScope);
        //helper.$httpBackend.flush();
        //expect(helper.$rootScope.people).toEqual(signInJsonSuccess);
        //console.log('ppp',$rootScope.people);

    });

});