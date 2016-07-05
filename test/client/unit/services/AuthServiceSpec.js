'use strict';

var config = require('../../../../.gen/config.json');
var helper=require('../angularHelper');

var signInJsonSuccess = { 'status': 'OK', 'username': 'demo' };
var signInJsonError = { 'status': 'FAIL'};


describe('Test service AuthService', function() {
    var authService;

    beforeEach(function () {
        angular.mock.module('app');
    });

    beforeEach(angular.mock.inject(function ($injector) {
        helper.init($injector);
        authService = $injector.get('AuthService');
    }));

    it('should sign in with success', function () {
        expect(authService.signIn).toBeDefined();
        var signInHandleSuccess = helper.$httpBackend.when(config.routing.signin.method, config.routing.signin.url)
            .respond(signInJsonSuccess);

        helper.$httpBackend.expectPOST(config.routing.signin.url);
        var user = {login: 'demo', password: 'demo'};

        authService.signIn(user, function (data, result) {
            expect(data).toBeDefined();
            expect(data.login).toEqual('demo');
            expect(data.password).toBeNull();
            expect(result).toEqual(signInJsonSuccess);
        });
        //console.log(helper.$rootScope);
        helper.$httpBackend.flush();
        //expect($rootScope.people).toEqual(people);
        //console.log('ppp',$rootScope.people);

    });

    it('should sign in with error', function () {
        expect(authService.signIn).toBeDefined();
        var signInHandleError = helper.$httpBackend.when(config.routing.signin.method, config.routing.signin.url)
            .respond(signInJsonError);

        helper.$httpBackend.expectPOST(config.routing.signin.url);
        var user = {login: 'demo', password: 'demo'};
        authService.signIn(user, function () {},
            function (data) {
                console.log('success', data);
                //expect(data).toBeDefined();
                //expect(data.login).toEqual('demo');
                //expect(data.password).toBeNull();
            });
        //console.log(helper.$rootScope);
        helper.$httpBackend.flush();

    });

    it('should sign up with success', function () {

    });
});