'use strict';

module.exports =
    (function () {

        return ['$scope', '$location', '$log', 'AuthService', 'vcRecaptchaService',
            function ($scope, $location, $log, AuthService, vcRecaptchaService) {
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
                            $scope.hasError = true;
                            vcRecaptchaService.reload();
                            $log.error('error sign up', error);
                            if (error) {
                                $scope.error.message = error.message;
                                $scope.error.status = error.status;
                            }
                        });
                };
            }];
    })();
