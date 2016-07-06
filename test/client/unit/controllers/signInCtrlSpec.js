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

        ctrl = $controller('SignInCtrl', {
            $scope : helper.$rootScope
        });
    }));

    it('should create a controller', function() {
        helper.$rootScope.formUser={$invalid: false};
        expect(helper.$rootScope.signIn).toBeDefined();
        expect(helper.$rootScope.hasError).toBeDefined();
        expect(helper.$rootScope.resetError).toBeDefined();
        expect(helper.$rootScope.hasError).toBeFalsy();

        //helper.$httpBackend.expectPOST(config.routing.signin.url);
        helper.$rootScope.signIn();
        console.log(helper.$rootScope);
        //helper.$httpBackend.flush();
        //expect($rootScope.people).toEqual(people);
        //console.log('ppp',$rootScope.people);

    });
    it('should call signin', function() {
        helper.$rootScope.formUser={$invalid: false};
        var userForm = {login :'demo', password: 'demo'};
        //helper.$httpBackend.expectPOST(config.routing.signin.url);
        helper.$rootScope.signIn();
        console.log(helper.$rootScope);
        //helper.$httpBackend.flush();
        //expect($rootScope.people).toEqual(people);
        //console.log('ppp',$rootScope.people);

    });


});