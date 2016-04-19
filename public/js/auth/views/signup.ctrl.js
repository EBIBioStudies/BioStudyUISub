'use strict';

module.exports =
    (function () {

        return ['$scope', '$location', 'AuthService', 'vcRecaptchaService',
            function ($scope, $location, AuthService, vcRecaptchaService) {
                $scope.user = {};
                $scope.error = {};
                $scope.hasError = false;
                $scope.success = false;
                $scope.showError = function () {
                    return $scope.hasError;
                };

                $scope.signUp = function (user, signUpForm) {
                    $scope.$broadcast('show-errors-check-validity');
                    if (signUpForm.$invalid) {
                        $scope.hasError = true;
                        $scope.error.message = 'Empty or invalid field!';
                        return;
                    }

                    AuthService
                        .signUp(user)
                        .then(function () {
                            $scope.hasError = false;
                            $scope.error = {};
                            $scope.success = true;
                        })
                        .catch(function (error, status) {
                            //grecaptcha.reset();
                            $scope.hasError = true;
                            vcRecaptchaService.reload();
                            console.log('error sign up', error);
                            if (error) {
                                $scope.error.message = error.message;
                                $scope.error.status = error.status;
                            }

                        });

                };
                /*function showRecaptcha() {
                 grecaptcha.create('6Lcmlv0SAAAAAHofnIcb29l1LMZsnGFcSlH8Reve', 'captcha',
                 {
                 theme : 'clean',
                 callback : Recaptcha.focus_response_field
                 });
                 }
                 //showRecaptcha();*/
            }];
    })();
