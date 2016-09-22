import 'angular';
import 'angular-mocks';
import '../../index';

describe('BioStudyApp.Auth module', () => {

    beforeEach(angular.mock.module('BioStudyApp.Auth'));

    describe('SignUpCtrl', () => {

        var $controller;
        var $rootScope;
        var fakeAuth;
        var fakeReCaptcha;

        beforeEach(inject((_$controller_, _$q_, _$rootScope_) => {
            $controller = _$controller_;
            fakeAuth = {
                signUp: () => {
                    return _$q_.when({status: 'FAIL', message: 'an error'});
                }
            };
            fakeReCaptcha = {
                reload: () => {
                }
            };
            $rootScope = _$rootScope_;
        }));

        describe('$scope.error', () => {
            it('shows error when sign up call failed', () => {
                var $scope = {};

                spyOn(fakeAuth, 'signUp').and.callThrough();
                spyOn(fakeReCaptcha, 'reload').and.callThrough();

                $controller('SignUpCtrl', {$scope: $scope, vcRecaptchaService: fakeReCaptcha, AuthService: fakeAuth});

                expect($scope.user).toEqual({});

                $scope.signUp();
                $rootScope.$apply();

                expect($scope.error).toEqual({status: 'Error', message: 'an error'});
                expect(fakeAuth.signUp).toHaveBeenCalled();
                expect(fakeReCaptcha.reload).toHaveBeenCalled();
            });
        });
    });
});
